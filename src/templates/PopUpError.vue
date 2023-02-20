<script setup>
import { watch } from 'vue';
import { close, showPopUp, hidePopUp } from '../library/helpers.js';

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
		showPopUp('error-pop-up-bg', 'alert-error');
	} else {
        hidePopUp('error-pop-up-bg', 'alert-error');
    }
});

</script>

<template>
	<div class="alertPopUp red" id="error-pop-up-bg" style="display: none; opacity: 0.8;"></div>
    <div class="popUp p red" id="alert-error">
        <h1>{{ title }}</h1>
        <div>
            <span>{{ message }}</span>
        </div>
        <div class="text-center">
            <button class="popUpCancel" @click.prevent="close('error-pop-up-bg', 'alert-error', trigger)">Ok</button>
        </div>
    </div>
</template>

<style>
    @import '../assets/popup.css';
</style>