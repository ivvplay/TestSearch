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
            console.log('Получить данные')
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

            console.log('ответ отправил')

        }
        catch (error) {
            console.log(error);
        }
    }

    async updateItems(req, res) {
        try {
            console.log('Обновление')
            const {str, search} = req.body;
            if(search === '')
            {
                this.setData([...str,...this.data.slice(str.length)])
            }
            else{
                const strMap = new Map(str.map(item => [item.id, item]));
                this.setData(this.data.map(item => strMap.get(item.id) || item))
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