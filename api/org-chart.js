const { queryRows } = require('./_db.js');

function buildTree(rows) {
    const byId = new Map();

    for (const row of rows) {
        byId.set(row.id, {
            id: row.id,
            positionId: row.position_id,
            level: row.level,
            parentNodeId: row.parent_node_id,
            sortOrder: row.sort_order ?? 0,
            title: row.title ?? null,
            children: [],
        });
    }

    const roots = [];

    for (const node of byId.values()) {
        if (node.parentNodeId == null) {
            roots.push(node);
        } else {
            const parent = byId.get(node.parentNodeId);
            if (parent) {
                parent.children.push(node);
            } else {
                roots.push(node);
            }
        }
    }

    const sortNodes = (list) => {
        list.sort((a, b) => {
            if (a.level !== b.level) return a.level - b.level;
            if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
            return a.id - b.id;
        });
        list.forEach((n) => sortNodes(n.children));
    };

    sortNodes(roots);
    return roots;
}

module.exports = async function handler(req, res) {
    try {
        if (req.method !== 'GET') {
            res.status(405).json({ ok: false, message: 'Method Not Allowed' });
            return;
        }

        const positions = await queryRows(
            `SELECT id, name_th, name_en
       FROM positions
       ORDER BY id`
        );

        const nodeRows = await queryRows(
            `SELECT
         id,
         position_id,
         level,
         parent_node_id,
         sort_order,
         title
       FROM org_nodes
       ORDER BY level, sort_order, id`
        );

        const tree = buildTree(nodeRows);

        res.status(200).json({
            positions,
            tree,
        });
    } catch (err) {
        console.error('Error in /api/org-chart:', err);
        res.status(500).json({
            ok: false,
            message: 'Internal server error',
        });
    }
};
