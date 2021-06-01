var helper = {};

/**
 * compare date to check two date time is the same date
 */

helper.checkTwoDateIsSameDate = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate()=== date2.getDate()
}

module.exports = helper