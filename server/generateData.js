module.exports = function getData(){
        return Array.from({length: 100}, (_, i) => ({
            id: `item-${i + 1}`,
            text: `Item ${i + 1}`,
            selected: false
        }));
}
