function getD() {
    let todayDate = new Date();
    let todayNum = todayDate.getDay();
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    let title = todayDate.toLocaleDateString('en-US', options);
    return title;
}

module.exports = getD;