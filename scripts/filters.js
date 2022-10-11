// Custom filters
import Vue from "vue";

Vue.filter("money", function(value, currency) {
    const curr = currency || { code: "EUR", rate: 1 };
    const floatVal = parseFloat(value);
    const inCurrency = floatVal * parseFloat(curr.rate);
    const formatter = new Intl.NumberFormat("de-AT", {
        style: "currency",
        currency: curr.code,
    });
    return formatter.format(inCurrency);
});

Vue.filter("cm2inch", function(value, html = false) {
    let fractions = ["", "1/8", "1/4", "3/8", "1/2", "5/8", "3/4", "7/8"];

    if (html) {
        fractions = fractions.map(function(fraction) {
            return fraction ? "&frac" + fraction.replaceAll("/", "") + ";" : fraction;
        });
    }

    let inchVal = value / 2.54;
    let fraction =
        fractions[Math.round((inchVal % 1) / (1 / (fractions.length - 1)))];

    return inchVal >= 1 ? `${Math.floor(inchVal)} ${fraction}` : fraction;
});