# CoffeeCropCare-api


CREATE USER 'coffeecropcare'@'localhost' IDENTIFIED WITH mysql_native_password BY 'coffee@123';
GRANT ALL PRIVILEGES ON *.* TO 'coffeecropcare'@'localhost' WITH GRANT OPTION;

sudo apt install redis-server redis-cli