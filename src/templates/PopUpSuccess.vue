<script setup>
import { watch } from 'vue';
import { close, showPopUp, hidePopUp } from '../Library/helpers.js';

const props = defineProps({
	title: String,
	message: String,
	show: Boolean,
	trigger: {
		type: Function,
		default: null,
	}
});

watch(() => props.show, (first, second) => {
	if(first) {
		showPopUp('success-pop-up-bg', 'alert-success');
	} else {
		hidePopUp('success-pop-up-bg', 'alert-success');
	}
});
</script>

<style>
    @import '../assets/popup.css';
</style>

<template>
	<div class="alertPopUp popUpGreen" id="success-pop-up-bg" style="display: none; opacity: 0.8;"></div>
    <div class="popUp p popUpGreen" id="alert-success">
        <h1>{{ title }}</h1>
        <div>
            <span>{{ message }}</span>
        </div>
        <div class="text-center">
            <button class="popUpCancel" @click.prevent="close('success-pop-up-bg', 'alert-success', trigger)">Ok</button>
        </div>
    </div>
</template>