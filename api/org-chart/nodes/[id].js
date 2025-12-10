const { queryRows } = require('../../_db.js');

module.exports = async function handler(req, res) {
    try {
        if (req.method !== 'DELETE') {
            res.status(405).json({ ok: false, message: 'Method Not Allowed' });
            return;
        }

        const { id } = req.query;
        const nodeId = Number(id);

        if (!Number.isFinite(nodeId)) {
            res.status(400).json({ ok: false, message: 'Invalid node id' });
            return;
        }

        await queryRows('DELETE FROM org_nodes WHERE id = $1', [nodeId]);

        res.status(200).json({ ok: true });
    } catch (err) {
        console.error('Error in DELETE /api/org-chart/nodes/[id]:', err);
        res.status(500).json({
            ok: false,
            message: 'Internal server error',
        });
    }
};
