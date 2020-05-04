{
    echo "["
    curl https://purge.jsdelivr.net/gh/Mushymato/mushymato.github.io@master/dl-sim-vue/css/chunk-vendors.css
    echo ","
    curl https://purge.jsdelivr.net/gh/Mushymato/mushymato.github.io@master/dl-sim-vue/css/app.css
    echo ","
    curl https://purge.jsdelivr.net/gh/Mushymato/mushymato.github.io@master/dl-sim-vue/js/chunk-vendors.js
    echo ","
    curl https://purge.jsdelivr.net/gh/Mushymato/mushymato.github.io@master/dl-sim-vue/js/app.js
    echo "]"
} > purge.json