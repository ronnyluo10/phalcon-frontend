const close = (alertWrap, alert, trigger) => {
 	const fadeTarget = document.getElementById(alertWrap), alertError = document.getElementById(alert);

	const fadeEffect = setInterval(() => {
		if(parseFloat(fadeTarget.style.opacity) > 0) {
			fadeTarget.style.opacity -= 0.1;
		} else {
			clearInterval(fadeEffect);
			alertError.classList.remove('popUpShow');
			alertError.classList.add('popUpHide');
			fadeTarget.style.display = 'none';

			if(typeof trigger !== 'undefined' && trigger) {
				trigger();
			}
		}
	}, 100);
};

const showPopUp = (alertWrap, alert) => {
	const fadeTarget = document.getElementById(alertWrap), alertError = document.getElementById(alert);

	fadeTarget.style.display = 'block';
	alertError.classList.remove('popUpHide');
	alertError.classList.add('popUpShow');
	fadeTarget.style.opacity = 0.8;
};

const hidePopUp = (alertWrap, alert) => {
	const fadeTarget = document.getElementById(alertWrap), alertError = document.getElementById(alert);

	fadeTarget.style.display = 'none';
	alertError.classList.add('popUpHide');
	alertError.classList.remove('popUpShow');
	fadeTarget.style.opacity = 0;
};

export { close, showPopUp, hidePopUp };