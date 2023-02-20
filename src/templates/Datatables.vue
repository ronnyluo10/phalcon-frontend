<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import FullScreenLoading from './FullScreenLoading.vue';
import PopUpError from './PopUpError.vue';
import PopUpSuccess from './PopUpSuccess.vue';

const props = defineProps({
    theads: Array,
    tbodys: Array,
    disableSearch: Array,
    disabledSort: Array,
    uri: String,
    deleteUri: String,
    comboboxFilter: {
        type: Object,
        default: {},
    },
    detailUri: String,
});

const loading = ref(false), params = ref({
    search: '',
    tbody: props.tbodys,
    disableSearch: props.disableSearch,
    offset: 1,
    sort: ['id', 'DESC'],
    filters: {},
}), sortLabel = ref('id'), rows = ref([]), totalRow = ref(0), totalPage = ref(0), pages = ref([]), errorTitle = ref(''), errorMessage = ref(''), errorPopUp = ref(false), formTitle = ref(''), detailData = ref({}), successTitle = ref(''), successMessage = ref(''), successPopUp = ref(false);

onMounted(() => {
    fetchData();
});

const setDefaultSort = () => {
    params.value.sort[0] = 'id';
    params.value.sort[1] = 'DESC';
    sortLabel.value = 'ID';
};

const sorting = (event, thead, index) => {
    if(props.disabledSort.indexOf(thead.toLowerCase()) === -1) {
        const field = params.value.sort[1].toLowerCase();

        sortLabel.value = thead.toLowerCase();
        params.value.sort[0] = props.tbodys[index];
        params.value.sort[1] = field === 'desc' ? 'ASC' : 'DESC';
        
        setTimeout(() => {
            fetchData();
        }, 200);
    }
};

const searching = (event) => {
    params.value.search = event.currentTarget.value;
    setDefaultSort();
    
    setTimeout(() => {
        fetchData();
    }, 200);
};

const clearSearch = (event) => {
    params.value.search = '';
    setDefaultSort();
    
    setTimeout(() => {
        fetchData();
    }, 200);
};

const filter = (event, label) => {
    params.value.filters[label] = event.currentTarget.value;

    setDefaultSort();

    setTimeout(() => {
        fetchData();
    }, 200);
};

const fetchData = () => {
    loading.value = true;

    const formData = new FormData();
    Object.keys(params.value).map((value, key) => {
        if(Array.isArray(params.value[value])) {
            for(let i = 0; i < params.value[value].length; i++) {
                formData.append(value+'[]', params.value[value][i]);
            }
        } else {
            if(value == 'filters') {
                if(Object.keys(params.value[value]).length > 0) {
                    Object.keys(params.value[value]).map((filterValue, filterKey) => {
                        formData.append(value+'['+filterValue+']', params.value[value][filterValue]);
                    });
                }
            } else {
                formData.append(value, params.value[value]);
            }
        }
    });

    fetch(props.uri, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
        },
        body: formData
    }).then(response => {
        return response.json();
        
    }).then(response => {
        const { result, status } = response;
        const { data } = result;
        
        switch(status.code) {
            case 200:
                rows.value = data;
                totalRow.value = result.totalRow;
                totalPage.value = result.totalPage;
                pages.value = result.pages;

                setTimeout(() => {
                    loading.value = false;
                    
                    successTitle.value = '';
                    successMessage.value = '';
                    successPopUp.value = false;

                    errorTitle.value = '';
                    errorMessage.value = '';
                    errorPopUp.value = false;
                }, 1000);
                break;
            default:
                errorTitle.value = 'Error retrieve patient data';
                errorMessage.value = status.message;
                errorPopUp.value = true;
                break;
        }
    }).catch(response => {
        errorTitle.value = 'Error retrieve patient data';
        errorMessage.value = 'Server side error';
        errorPopUp.value = true;
    });
};

const previous = () => {
    if(params.value.offset > 1) {
        pagination(params.value.offset - 1);
    }
};

const next = () => {
    if(params.value.offset < totalRow.value) {
        pagination(params.value.offset + 1);
    }
};

const pageClick = (number) => {
    if(number != params.value.offset) {
        pagination(number);
    }
};

const pagination = (page) => {
    params.value.offset = page;
    
    setTimeout(() => {
        fetchData();
    }, 200);
};

const showDetail = (id) => {
    fetch(props.detailUri+id).then(response => {
        return response.json();
    }).then(response => {
        if(response.status.code == 200) {
            detailData.value = response.result
        } else {
            errorTitle.value = 'Error retrieve patient data';
            errorMessage.value = 'Server side error';
            errorPopUp.value = true;
        }
    }).catch(response => {
        errorTitle.value = 'Error retrieve patient data';
        errorMessage.value = 'Server side error';
        errorPopUp.value = true;
    });;
};

const closeDetail = () => {
    detailData.value = {}
};

const editForm = (id) => {
    window.location.href = "/patient/edit/"+id
};

const deleteData = (id, description) => {
    if(confirm("Are sure want to delete "+description)) {
        fetch(props.deleteUri+id, {
            method: 'DELETE',
        }).then(response => {
            return response.json();
        }).then(response => {
            if(response.status.code) {
                successTitle.value = response.status.response;
                successMessage.value = response.status.message;
                successPopUp.value = true;
            }
        }).catch(response => {
            errorTitle.value = 'Error retrieve patient data';
            errorMessage.value = 'Server side error';
            errorPopUp.value = true;
        });
    }
};
</script>

<template>
    <FullScreenLoading :loading="loading" />

    <div v-if="Object.keys(detailData).length > 0" style="position: fixde; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5);">
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: #fff; padding: 15px; color: #333;">
            <div class="relative">
                <h3>Patient Detail</h3>
                
                <div style="position: absolute; right: 0; top: 0; cursor: pointer;" @click.prevent="closeDetail">X</div>

                <div style="display: flex;" v-for="(value, key) in detailData" :key="key">
                    <div style="width: 150px;">{{ key.replace("_", " ") }}</div>
                    <div>{{ ': '+value }}</div>
                </div>
            </div>
        </div>
    </div>

    <PopUpError 
        :title="errorTitle"
        :message="errorMessage"
        :show="errorPopUp"
        :trigger="fetchData"
    />

    <PopUpSuccess 
        :title="successTitle"
        :message="successMessage"
        :show="successPopUp"
        :trigger="fetchData"
    />

    <div class="w-full relative">
        <input 
            type="search"
            class="border-gray-300 rounded-md w-full p-0.5"
            placeholder="Search"
            v-on:keyup.enter="searching"
            v-model="params.search"
        />
        <span v-if="params.search" class="block absolute right-0 top-0 clear-search bg-sky-900 text-white hover:cursor-pointer" @click.prevent="clearSearch">&#x2715;</span>
    </div>

    <div v-if="Object.keys(comboboxFilter).length > 0">
        <select class="border-gray-300 rounded-md shadow-sm w-full mt-4 p-0.5" :key="key" v-for="(value, key) in comboboxFilter" @change="filter($event, key)">
            <option value="">{{ 'Select '+key }}</option>
            <option v-for="(comboboxValue, comboboxKey) in value" :key="comboboxKey" :value="comboboxKey">
                {{ comboboxValue }}
            </option>
        </select>
    </div>

    <div class="mt-4 mb-4">
        <RouterLink to="/patient/create">Add Patient Data</RouterLink>
    </div>

    <div class="overflow-x-auto">
        <table class="table" v-show="!loading">
            <thead class="bg-white dark:bg-slate-900">
                <tr>
                    <th v-for="(thead, key) in theads" :key="key" @click.prevent="sorting($event, thead, key)">
                        {{ thead }}
                        <span v-if="disabledSort.indexOf(thead.toLowerCase()) === -1">
                            <span v-if="sortLabel.toLowerCase() === thead.toLowerCase()">
                                {{ params.sort[1].toLowerCase() === 'desc' ? "&#8648;" : "&#8650;" }}
                            </span>

                            <span class="text-gray-500" v-else>
                                &#8650;
                            </span>
                        </span>
                    </th>
                    <th></th>
                </tr>
            </thead>

            <tbody v-if="rows.length > 0">
                <tr v-for="(row, rowKey) in rows" :key="rowKey">
                    <td v-for="(tbody, key) in tbodys" :key="key">
                        <div v-html="row[tbody]" @click.prevent="showDetail(row.id)"></div>
                    </td>
                    <td>
                        <button @click.prevent="editForm(row.id)">Edit</button> &nbsp;
                        <button @click.prevent="deleteData(row.id, row.name)">Delete</button>
                    </td>
                </tr>
            </tbody>

            <tfoot v-if="totalPage > 1">
                <tr>
                    <td :colspan="tbodys.length + 1">
                        <div class="float-left">
                            {{ totalRow+' entries' }}   
                        </div>

                        <div class="float-right">
                            <ul class="pagination" v-if="totalPage < 6">
                                <li v-for="(number, key) in pages" :class="params.offset == number ? 'active' : ''" @click="pageClick(number)" :key="key">{{ number }}</li>
                            </ul>
                            <ul class="pagination" v-else>
                                <li @click="previous">Previous</li>
                                <li v-if="params.offset > 1" @click="pageClick(1)">1</li>
                                <li v-if="params.offset >= 5">...</li>
                                <li v-for="(number, key) in pages" :class="params.offset == number ? 'active' : ''" @click="pageClick(number)" :key="key">{{ number }}</li>
                                <li v-if="params.offset < 5 || params.offset + 5 < totalPage">...</li>
                                <li v-if="params.offset < totalPage" @click="pageClick(totalPage)">{{ totalPage }}</li>
                                <li @click="next">Next</li>
                            </ul>
                        </div>

                        <div class="clear-both"></div>
                    </td>
                </tr>
            </tfoot>
        </table>
    </div>
</template>

<style>
:root {
    --primary-color: #111827;
    --secondary-color: #6b7280;
}

.float-left {
    float: left;
}

.float-right {
    float: right;
}

.clear-both {
    clear: both;
}

.relative {
    position: relative;
}

.w-full {
    width: 100%;
}

.mb-4 {
    margin-bottom: 2rem;
}

.mt-4 {
    margin-top: 2rem;
}

.clear-search {
    display: block;
    width: 30px;
    height: 100%;
    position: absolute;
    top: 1px;
    right: 0;
    border-top-right-radius: 0.375rem;
    border-bottom-right-radius: 0.375rem;
    padding-top: 5px;
    text-align: center;
}

.clear-search:hover {
    cursor: pointer;
}

.text-white {
    --tw-text-opacity: 1;
    color: rgb(255 255 255);
}

.bg-sky-900 {
    --tw-bg-opacity: 1;
    background-color: rgb(12 74 110);
}

.block {
    display: block;
}

.top-0 {
    top: 0;
}

.right-0 {
    right: 0;
}

.absolute {
    position: absolute;
}

.border-gray-300 {
    --tw-border-opacity: 1;
    border-color: rgb(209 213 219);
}

.rounded-md {
    border-radius: 0.375rem;
}

.p-0\.5 {
    padding: 0.5rem;
}

.pagination {
    justify-content: flex-end;
    border-radius: 0.25rem;
    display: flex;
    list-style: none;
    padding-left: 0;
}

.pagination > li {
    margin-left: 5px;
    padding-right: 10px;
    padding-left: 10px;
    color: #666666;
}

.pagination > li.active {
    border: 1px solid var(--primary-color);
    background: linear-gradient(to bottom, var(--secondary-color) 0, var(--primary-color) 100%);
    color: #ffffff;
}

.pagination > li:hover {
    cursor: pointer;
}
</style>