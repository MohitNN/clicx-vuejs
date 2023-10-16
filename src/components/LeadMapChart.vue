<template>
    <h5> Live Leads </h5>
    <div id="chartdiv">

    </div>
</template>
<script>
import { onMounted, reactive, ref, watch } from 'vue';
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated"
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";

export default {
    name: 'MapComponent',
    mounted() {
        var root = am5.Root.new("chartdiv");
        root._logo.dispose();

        // Set themes
        root.setThemes([
            am5themes_Animated.new(root)
        ]);

        var chart = root.container.children.push(
            am5map.MapChart.new(root, {
                panX: "rotateX",
                projection: am5map.geoMercator()
            })
        );

        // Create polygon series
        var polygonSeries = chart.series.push(
            am5map.MapPolygonSeries.new(root, {
                geoJSON: am5geodata_worldLow,
                exclude: ["AQ"]
            })
        );

        polygonSeries.mapPolygons.template.setAll({
            tooltipText: "{name}",
            interactive: true
        });

        polygonSeries.mapPolygons.template.states.create("hover", {
            fill: am5.color(0x677935)
        });

    }
}
</script>
<style scoped>
   #chartdiv {
      height: 600px;
      width: 100%;
   }
</style>