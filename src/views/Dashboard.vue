<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import ProductService from '@/service/ProductService';
import { useLayout } from '@/layout/composables/layout';
// import LeadMapChart from '@/components/LeadMapChart.vue';
import LeadMapChartV4 from '@/components/LeadMapChartV4.vue';


const { isDarkTheme, layoutConfig } = useLayout();

let documentStyle = getComputedStyle(document.documentElement);
const pieData = ref(null);

const demoTableData = ref([
{
                    id: '1000',
                    code: 'f230fh0g3',
                    name: 'Bamboo Watch',
                    description: 'Product Description',
                    image: 'bamboo-watch.jpg',
                    price: 65,
                    category: 'Accessories',
                    quantity: 24,
                    inventoryStatus: 'INSTOCK',
                    rating: 5
                },
                {
                    id: '1001',
                    code: 'nvklal433',
                    name: 'Black Watch',
                    description: 'Product Description',
                    image: 'black-watch.jpg',
                    price: 72,
                    category: 'Accessories',
                    quantity: 61,
                    inventoryStatus: 'INSTOCK',
                    rating: 4
                },
                {
                    id: '1002',
                    code: 'zz21cz3c1',
                    name: 'Blue Band',
                    description: 'Product Description',
                    image: 'blue-band.jpg',
                    price: 79,
                    category: 'Fitness',
                    quantity: 2,
                    inventoryStatus: 'LOWSTOCK',
                    rating: 3
                },
                {
                    id: '1003',
                    code: '244wgerg2',
                    name: 'Blue T-Shirt',
                    description: 'Product Description',
                    image: 'blue-t-shirt.jpg',
                    price: 29,
                    category: 'Clothing',
                    quantity: 25,
                    inventoryStatus: 'INSTOCK',
                    rating: 5
                },
                {
                    id: '1004',
                    code: 'h456wer53',
                    name: 'Bracelet',
                    description: 'Product Description',
                    image: 'bracelet.jpg',
                    price: 15,
                    category: 'Accessories',
                    quantity: 73,
                    inventoryStatus: 'INSTOCK',
                    rating: 4
                },
])

pieData.value = {
    labels: ['A', 'B', 'C'],
    datasets: [
        {
            data: [540, 325, 702],
            backgroundColor: [documentStyle.getPropertyValue('--indigo-500'), documentStyle.getPropertyValue('--purple-500'), documentStyle.getPropertyValue('--teal-500')],
            hoverBackgroundColor: [documentStyle.getPropertyValue('--indigo-400'), documentStyle.getPropertyValue('--purple-400'), documentStyle.getPropertyValue('--teal-400')]
        }
    ]
};
const products = ref(null);
const lineData = reactive({
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            backgroundColor: '#2f4860',
            borderColor: '#2f4860',
            tension: 0.4
        },
        {
            label: 'Second Dataset',
            data: [28, 48, 40, 19, 86, 27, 90],
            fill: false,
            backgroundColor: '#00bb7e',
            borderColor: '#00bb7e',
            tension: 0.4
        }
    ]
});
const items = ref([
    { label: 'Add New', icon: 'pi pi-fw pi-plus' },
    { label: 'Remove', icon: 'pi pi-fw pi-minus' }
]);
const lineOptions = ref(null);
const productService = new ProductService();

onMounted(() => {
    productService.getProductsSmall().then((data) => (products.value = data));
});

const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};
const applyLightTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            }
        }
    };
};

const applyDarkTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#ebedef'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            },
            y: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            }
        }
    };
};

watch(
    isDarkTheme,
    (val) => {
        if (val) {
            applyDarkTheme();
        } else {
            applyLightTheme();
        }
    },
    { immediate: true }
);

</script>

<template>
    <div class="grid flex-column">
        <div>
            <div class=" xl:flex">
                <div class="col-12 xl:col-12">
                    <div class="card">
                        <LeadMapChartV4 />
                    </div>
                </div>
                  <!-- this commented code in backup-files/dashboard.txt  -->
            </div>
            <div class="w-full">
                <div class="md:flex flex-wrap">
                    <div class="col-12 md:col-6 pt-0 xl:p-3 lg:col-3">
                        <div class="surface-card shadow-2 p-3 border-round">
                            <div class="flex justify-content-between mb-3">
                                <div>
                                    <span class="block text-500 font-medium mb-3">Orders</span>
                                    <div class="text-900 font-medium text-xl">152</div>
                                </div>
                                <div class="flex align-items-center justify-content-center bg-blue-100 border-round"
                                    style="width: 2.5rem; height: 2.5rem">
                                    <i class="pi pi-shopping-cart text-blue-500 text-xl"></i>
                                </div>
                            </div>
                            <span class="text-green-500 font-medium">24 new </span>
                            <span class="text-500">since last visit</span>
                        </div>
                        <div>
                            <DataTable :value="products" class="scrollbar mt-2 table-dashboard" id="style-1" tableStyle="min-width: 50rem">
                                <Column field="code" header="Code"></Column>
                                <Column field="name" header="Name"></Column>
                                <Column field="category" header="Category"></Column>
                                <Column field="quantity" header="Quantity"></Column>
                            </DataTable>
                        </div>
                    </div>
                    
                    <div class="col-12 md:col-6 lg:col-3">
                        <div class="surface-card shadow-2 p-3 border-round">
                            <div class="flex justify-content-between mb-3">
                                <div>
                                    <span class="block text-500 font-medium mb-3">Revenue</span>
                                    <div class="text-900 font-medium text-xl">$2.100</div>
                                </div>
                                <div class="flex align-items-center justify-content-center bg-orange-100 border-round"
                                    style="width: 2.5rem; height: 2.5rem">
                                    <i class="pi pi-map-marker text-orange-500 text-xl"></i>
                                </div>
                            </div>
                            <span class="text-green-500 font-medium">%52+ </span>
                            <span class="text-500">since last week</span>
                        </div>
                        <div class="">
                            <DataTable :value="products" class="scrollbar mt-2 table-dashboard" id="style-1" tableStyle="min-width: 50rem">
                                <Column field="code" header="Code"></Column>
                                <Column field="name" header="Name"></Column>
                                <Column field="category" header="Category"></Column>
                                <Column field="quantity" header="Quantity"></Column>
                            </DataTable>
                        </div>
                    </div>
                    <div class="col-12 md:col-6 lg:col-3">
                        <div class="surface-card shadow-2 p-3 border-round">
                            <div class="flex justify-content-between mb-3">
                                <div>
                                    <span class="block text-500 font-medium mb-3">Customers</span>
                                    <div class="text-900 font-medium text-xl">28441</div>
                                </div>
                                <div class="flex align-items-center justify-content-center bg-cyan-100 border-round"
                                    style="width: 2.5rem; height: 2.5rem">
                                    <i class="pi pi-inbox text-cyan-500 text-xl"></i>
                                </div>
                            </div>
                            <span class="text-green-500 font-medium">520 </span>
                            <span class="text-500">newly registered</span>
                        </div>
                        <div>
                            <DataTable :value="products" class="scrollbar mt-2 table-dashboard" id="style-1" tableStyle="min-width: 50rem">
                                <Column field="code" header="Code"></Column>
                                <Column field="name" header="Name"></Column>
                                <Column field="category" header="Category"></Column>
                                <Column field="quantity" header="Quantity"></Column>
                            </DataTable>
                        </div>
                    </div>
                    <div class="col-12 md:col-6 lg:col-3">
                        <div class="surface-card shadow-2 p-3 border-round">
                            <div class="flex justify-content-between mb-3">
                                <div>
                                    <span class="block text-500 font-medium mb-3">Comments</span>
                                    <div class="text-900 font-medium text-xl">152 Unread</div>
                                </div>
                                <div class="flex align-items-center justify-content-center bg-purple-100 border-round"
                                    style="width: 2.5rem; height: 2.5rem">
                                    <i class="pi pi-comment text-purple-500 text-xl"></i>
                                </div>
                            </div>
                            <span class="text-green-500 font-medium">85 </span>
                            <span class="text-500">responded</span>
                        </div>
                        <div>
                            <DataTable :value="products" class="scrollbar mt-2 table-dashboard" id="style-1" tableStyle="min-width: 50rem">
                                <Column field="code" header="Code"></Column>
                                <Column field="name" header="Name"></Column>
                                <Column field="category" header="Category"></Column>
                                <Column field="quantity" header="Quantity"></Column>
                            </DataTable>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style >
.card .p-chart canvas {
    height: 240px !important;
    width: 235px !important;
}
.table-dashboard{
    height: 215px !important;
    overflow-y: scroll !important;
}
.table-dashboard .p-datatable-table{
    min-width: 0px !important;
}
.table-dashboard .p-datatable-table .p-column-title{
    font-size: 10px !important;
}
.table-dashboard .p-datatable-table td{
    font-size: 10px !important;
}
.table-dashboard .p-datatable-tbody > tr > td{
    padding: 0.5rem 1rem !important;
}
.table-dashboard .p-datatable-thead > tr > th{
    padding: 0.5rem 1rem !important;
}

.table-dashboard .p-datatable-table thead{
    position: sticky !important;
    top: 0 !important;
}


</style>
<style scoped>
.scrollbar
{
	overflow-y: auto;
}

#style-1::-webkit-scrollbar-track
{
	background-color: #F5F5F5;
    
}

#style-1::-webkit-scrollbar
{
	width: 7px;
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
	background-color: #F5F5F5;
}

#style-1::-webkit-scrollbar-thumb
{
    border-radius: 12px;
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
	background-color: #aca9a9;
}
</style>