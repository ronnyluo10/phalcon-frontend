<script setup>
import { onMounted, ref, reactive } from 'vue';
import { useRoute } from 'vue-router';
import PopUpSuccess from '../../templates/PopUpSuccess.vue';

onMounted(() => {
    masterData();

    const route = useRoute();

    if(Object.keys(route.params).length > 0) {
    	const { id } = route.params;
    	if(id) {
    		editID.value = id;
    		getData(id);
    	}
    }
});

const form = reactive({
    name: '',
    sex: '',
    religion: '',
    phone: '',
    address: '',
    nik: '',
    processing: false,
    errors: [],
    stringError: '',
});

const comboboxFilter = ref({}), successTitle = ref(''), successMessage = ref(''), successPopUp = ref(false), editID = ref(null);

const getData = (id) => {
	fetch(import.meta.env.VITE_API_ENDPOINT+'patients/show/'+id).then(response => {
		return response.json();
	}).then(response => {
		if(response.status.code == 200) {
			const { result } = response;
			form.name = result.name;
			form.sex = result.sex;
			form.religion = result.religion;
			form.phone = result.phone;
			form.address = result.address;
			form.nik = result.nik;
		}
	}).catch(response => {

	});
};

const masterData = () => {
	fetch(import.meta.env.VITE_API_ENDPOINT+'master/data').then(response => {
		return response.json();
	}).then(response => {
		comboboxFilter.value = response.result;
	}).catch(response => {

	});
};

const submitForm = () => {
	form.processing = true;
	form.errors = [];

	let headers = {
		Accept: 'application/json'
	};
	let method = 'POST', uri = import.meta.env.VITE_API_ENDPOINT+'patients/store';

	if(editID.value) {
		method = 'PUT';
		uri = import.meta.env.VITE_API_ENDPOINT+'patients/update/'+editID.value;
		headers['Content-Type'] = "application/x-www-form-urlencoded";
		
		var formData = [];
		for (var property in form) {
			var encodedKey = encodeURIComponent(property);
			var encodedValue = encodeURIComponent(form[property]);
			formData.push(encodedKey + "=" + encodedValue);
		}
		formData = formData.join("&");
	} else {
		var formData = new FormData();

		Object.keys(form).map((value, key) => {
			if(value == 'phone') {
				let phone = form[value];
				if(phone[0] == '6' && phone[1] == '2') {
					phone = phone.substring(2);
				} else if(phone[0] == '0') {
					phone = phone.substring(1);
				}

				formData.append(value, '62'+phone);
			} else {
				formData.append(value, form[value]);
			}
		});
	}

	setTimeout(() => {
		fetch(uri, {
		method: method,
			headers: headers,
			body: formData	
		}).then(response => {
			return response.json();
		}).then(response => {
			const {result, status} = response;

			form.processing = false;

			if(status.code == 422) {
				form.errors = result;
			} else if(status.code == 200) {
				successTitle.value = status.response;
				successMessage.value = status.message;
				successPopUp.value = true;
			} else {
				form.stringError = status.message;
			}
		}).catch(response => {
			form.processing = false;
			console.log(response);
		});
	}, 1000);
};

const backToPatientList = () => {
	window.location.href = "/patients"
};
</script>

<template>
	<div>
		<PopUpSuccess 
	        :title="successTitle"
	        :message="successMessage"
	        :show="successPopUp"
	        :trigger="backToPatientList"
	    />

		<h3>Patient Form</h3>

		<div class="w-full">
			<div class="mt-2">
				<label>Name *</label>
				<input type="text" class="w-full form-input" name="name" id="name" v-model="form.name">
			</div>
			<div class="mt-2">
				<label>Sex *</label>
				<select name="sex" id="sex" class="w-full form-input" v-model="form.sex">
					<option value="">Select Sex</option>
					<option v-for="(value, key) in comboboxFilter.sex" :value="key" :key="key">{{ value }}</option>
				</select>
			</div>
			<div class="mt-2">
				<label>Religion *</label>
				<select name="religion" id="religion" class="w-full form-input" v-model="form.religion">
					<option value="">Select Religion</option>
					<option v-for="(value, key) in comboboxFilter.religion" :value="key" :key="key">{{ value }}</option>
				</select>
			</div>
			<div class="mt-2 relative">
				<label>Phone *</label>
				<input type="text" id="phone" name="phone" class="w-full form-input phone" v-model="form.phone">
				<div class="phone_number_code_wrapper">
					<span>+62</span>
				</div>
			</div>
			<div class="mt-2 relative">
				<label>Address *</label>
				<input type="text" id="address" name="address" class="w-full form-input" v-model="form.address">
			</div>
			<div class="mt-2 relative">
				<label>NIK *</label>
				<input type="text" id="nik" name="nik" class="w-full form-input" v-model="form.nik">
			</div>

			<div class="mt-2">
				<button :disabled="form.processing" @click.prevent="submitForm">Submit</button>
			</div>

			<div class="mt-2" v-if="form.errors.length > 0">
				<div class="text-red" v-for="(error, key) in form.errors" :key="key">{{ error.message }}</div>
			</div>

			<div class="mt-2" v-if="form.stringError">
				<div class="text-red">{{ form.stringError }}</div>
			</div>
		</div>
	</div>
</template>

<style>
.w-full {
	width: 100%;
}

.relative {
	position: relative;
}

.text-red {
	color: red;
}

.mt-2 {
	margin-top: 1rem;
}

.form-input {
	padding: 10px;
}

.phone {
	padding-left: 40px;
	font-size: 16px;
}

.phone_number_code_wrapper {
	background-color: transparent;
    margin-left: 10px;
    margin-top: 13px;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate(0, -50%);
    color: black;
}
</style>