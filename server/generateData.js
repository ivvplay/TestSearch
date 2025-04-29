module.exports = function getData(){
        return Array.from({length: 1000000}, (_, i) => ({
            id: `item-${i + 1}`,
            text: `Item ${i + 1}`,
            selected: false
        }));
}
