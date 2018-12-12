function fillObject(num = 0, dfValue = 0) {
    return Array(num).fill(dfValue).reduce((cur, next, index) => ({ ...cur, [index + 1]: next }) , {});
}


function HistoryManager() {
    const self = this;
    self.histories = [];
    self.chartHistories =  Array(20).fill(null)
    self.circleHistories =  Array(60).fill(null);


    self.addHistory = (ht) => {
        self.histories = [
            ...self.histories,
            {
                ...ht,
            },
        ]

        let isAddChart = false;
        let isAddCircle = false;
        self.chartHistories = self.chartHistories.map(item => {
            if (item === null && !isAddChart) {
                isAddChart = true;
                return ht;
            }
            return item;
        })

        self.circleHistories = self.circleHistories.map(item => {
            if (item === null && !isAddCircle) {
                isAddCircle = true;
                return ht;
            }
            return item;
        })

        if (!isAddChart) {
            self.chartHistories = Array(20).fill(null);
            self.chartHistories[0] = ht;
        }
        if (!isAddCircle) {
            self.circleHistories = Array(60).fill(null);
            self.chartHistories[0] = ht;
        }
    }

    self.setHistories = (data) => {
        self.histories = data;
    }
 

    self.getHistories = (limit = 20) => {
        return self.histories.slice(0, limit);
    }
}