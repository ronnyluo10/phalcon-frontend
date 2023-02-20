<script setup>
import { onMounted, ref } from 'vue';
import Datatables from '../templates/Datatables.vue';

const theads = ['ID', 'Name', 'Phone', 'NIK'], tbodys = ['id', 'name', 'phone', 'nik'], disableSearch = [], disabledSort = [], uri = import.meta.env.VITE_API_ENDPOINT+'patients/list', deleteUri = import.meta.env.VITE_API_ENDPOINT+'patients/delete/', comboboxFilter = ref({}), detailUri = import.meta.env.VITE_API_ENDPOINT+'patients/show/';

onMounted(() => {
    masterData();
});

const masterData = () => {
	fetch('http://localhost/phalcon-project/api/master/data').then(response => {
		return response.json();
	}).then(response => {
		comboboxFilter.value = response.result;
	});
};
</script>

<template>
	<div>
		<Datatables 
            :theads="theads"
            :tbodys="tbodys"
            :uri="uri"
            :disabledSort="disabledSort"
            :disableSearch="disableSearch"
            :deleteUri="deleteUri"
            :comboboxFilter="comboboxFilter"
            :detailUri="detailUri"
        />
	</div>
</template>

<style>
.overflow-x-auto {
	overflow-x: auto;
}

.table {
	border-collapse: collapse;
  	width: 100%;
}

.table td, .table th {
	border: 1px solid #ddd;
  	padding: 8px;
}

.table tr:nth-child(even) {
	background-color: #f2f2f2;
	color: #333;
}

.table tr:hover {
	background-color: #ddd;
	color: #333;
	cursor: pointer;
}

.table th {
	padding-top: 12px;
	padding-bottom: 12px;
	text-align: left;
	background-color: #04AA6D;
	color: white;
}
</style>