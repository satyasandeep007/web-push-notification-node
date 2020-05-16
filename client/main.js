function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    console.log(padding, 'padding');
    console.log(base64String, 'base64String');


    const base64 = (base64String)
        .replace(/-/g, '+')
        .replace(/_/g, '/')
        .replace(/</g, '')
        .replace(/>/g, '');

    console.log(base64, "base");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

const publicVapidKey = '<BB5tODwHL4ToeVl8NIhqknpNiJgS5E7GIaH4TZqHPFiXG9S0EJAUPV_1SwMU4JjES5OTe_GSzNxAOv4Bvyfnmgg>';

const triggerPush = document.querySelector('.trigger-push');

async function triggerPushNotification() {
    if ('serviceWorker' in navigator) {
        const register = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
        });

        const subscription = await register.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        });

        await fetch('/subscribe', {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } else {
        console.error('Service workers are not supported in this browser');
    }
}

triggerPush.addEventListener('click', () => {
    triggerPushNotification().catch(error => console.error(error));
});