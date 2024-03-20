
CREATE DATABASE sample_stock_db;

USE sample_stock_db;

CREATE TABLE sample_data_historic (
    ticker VARCHAR(225),
    date DATE,
    revenue LONG,
    gp LONG,
    fcf LONG,
    capex LONG
);