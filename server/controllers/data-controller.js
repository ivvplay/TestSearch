const getData = require('../generateData');

class DataController {
    data;
    dataReset;

    constructor() {
        this.data = getData();
        this.dataReset = getData();
    }

    setData(data) {
        this.data = data;
    }

    async getItems(req, res) {
        try {
            const page = req.query.page || 1;
            const limit = req.query.limit || 20;
            const search = req.query.q || '';

            if (isNaN(page) || isNaN(limit)) {
                return res.status(400).json({ error: 'Invalid page or limit parameter' });
            }
            const filteredData = this.data.filter(item =>
                item.text.toLowerCase().includes(search.toLowerCase())
            );

            const paginatedData = filteredData.slice((page - 1) * limit, page * limit);
            res.setHeader('x-total-count', `${this.data.length}`);
            res.json(
                paginatedData
            );

        }
        catch (error) {
            console.log(error);
        }
    }

    async updateItems(req, res) {
        try {
            const {updateItem, position} = req.body;

            if(Object.keys(position).length === 0) {
                this.setData(this.data.map(item =>
                    item.id === updateItem.id ? updateItem : item
                ))
            }
            else{
                const result = [...this.data]
                const indexMap = new Map();
                result.forEach((item, index) => indexMap.set(item.id, index));
                if('up' in position && 'down' in position || 'down' in position ){
                    const dIdx = indexMap.get(updateItem.id);
                    const rIdx = indexMap.get(position.down.id);
                    result.splice(dIdx, 1);
                    const cIdx = dIdx < rIdx ? rIdx - 1 : rIdx;

                    result.splice(cIdx, 0, updateItem);
                    this.setData(result);
                }
                else if('up' in position){
                    const dIdx = indexMap.get(updateItem.id);
                    const rIdx = indexMap.get(position.up.id);
                    result.splice(dIdx, 1);
                    result.splice(rIdx, 0, updateItem);
                    this.setData(result);
                }
            }

            res.status(200).json({
                message: 'Data updated successfully',
            });
        }
        catch (error) {
            console.log(error);
        }
    }
}

module.exports = new DataController();