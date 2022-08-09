export default function Player(config) {
    if (typeof(window !== 'undefined')) {
        CreatePlayer(config);
        return "";
    }
}
    
function CreatePlayer(config) {
    if (window.Playerjs) {
        window.Playerjs.id = config.id
        window.PlayerJSControl = new window.Playerjs(config);
    } else {
        if (!window.pjscnfgs) {
            window.pjscnfgs = {};
        }
        window.pjscnfgs[config.id] = config;
    }
}
    
if (typeof(window) !== 'undefined') {
    window.PlayerjsAsync = function () {
        if (window.pjscnfgs) {
            Object.entries(window.pjscnfgs).map(([key, value]) => {
                if (window.Playerjs) {
                    window.PlayerJSControl = new window.Playerjs(value)
                    return;
                }
                return;
            });
        }
        window.pjscnfgs = {};
    };
}




