const { faker } = require('@faker-js/faker');

const generateProduct = () => {
    return {
        title: faker.commerce.productName(),
        price: faker.commerce.price(),
        department: faker.commerce.department(),
    }
}

module.exports = generateProduct;

