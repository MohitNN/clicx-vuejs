<script setup>
import { onMounted, ref } from 'vue';
import mock from './mock';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

const mapType = ref(false);
const mapObj = ref(null);
let map;
const init = () => {

    //create canvas map
    am4core.useTheme(am4themes_animated);
    map = am4core.create('chartdiv', am4maps.MapChart);
    map.logo.disabled = true;
    map.homeZoomLevel = 1.2;
    map.panBehavior = 'move';
    map.geodata = am4geodata_worldLow;
    map.projection = new am4maps.projections.Miller();
    map.chartContainer.wheelable = true;
    map.seriesContainer.draggable = true;
    map.seriesContainer.resizable = true;
    let polygonSeries = map.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.useGeodata = true;
    map.series.push(polygonSeries);

    //map template design
    let polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = '{name}';
    polygonTemplate.fill = am4core.color('#6794DC');
    polygonTemplate.fillOpacity = 1;
    let kk = polygonTemplate.states.create('hover');
    kk.properties.fillOpacity = 0.5;
    // polygonTemplate.stroke = am4core.color('#779FE0');
    polygonTemplate.strokeOpacity = 0.5;

    // puls data
    var imageSeries = map.series.push(new am4maps.MapImageSeries());
    imageSeries.mapImages.template.propertyFields.longitude = 'longitude';
    imageSeries.mapImages.template.propertyFields.latitude = 'latitude';
    imageSeries.mapImages.template.tooltipText = '{title}';
    imageSeries.mapImages.template.propertyFields.url = 'url';

    //puls without animate
    var circle = imageSeries.mapImages.template.createChild(am4core.Circle);
    circle.radius = 4;
    circle.propertyFields.fill = 'color';
    circle.nonScaling = true;

    //over puls animate
    var circle2 = imageSeries.mapImages.template.createChild(am4core.Circle);
    circle2.radius = 6;
    circle2.propertyFields.fill = 'color';

    circle2.events.on('inited', function (event) {
        animateBullet(event.target);
    });

    function animateBullet(circle) {
        var animation = circle.animate(
            [
                { property: 'scale', from: 1, to: 5 },
                { property: 'opacity', from: 1, to: 0 }
            ],
            1000,
            am4core.ease.circleOut
        );
        animation.events.on('animationended', function (event) {
            animateBullet(event.target.object);
        });
    }
    imageSeries.data = mock;
    mapObj.value = map;
};

const handleMapSwitch = (value) => {
    map.deltaLatitude = 0;
    map.deltaLongitude = 0;
    map.deltaGamma = 0;
    if (value) {
        map.projection = new am4maps.projections.Orthographic();
        map.panBehavior = 'rotateLongLat';
        map.homeZoomLevel = 1;
    } else {
        map.projection = new am4maps.projections.Miller();
        map.panBehavior = 'move';
        map.homeZoomLevel = 1.2;
    }
};

onMounted(() => {
    init();
});
</script>
<template>
    <h5>Live Leads</h5>
    <div>
        <InputSwitch @update:modelValue="handleMapSwitch" v-model="mapType" />
        <div class="map" id="chartdiv"></div>
    </div>
</template>

<style>
#chartdiv {
    width: 100%;
    height: 600px;
}
</style>
