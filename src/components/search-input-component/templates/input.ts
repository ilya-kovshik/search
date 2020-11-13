const getInputTemplate = (config: {datalistId: string, ctrlButtons: string}): string => (`
        <div class="${config.datalistId}__wrapper">
            <div id="${config.datalistId}">
                <input id="${config.datalistId}__input" type="text">
                <i id="${config.datalistId}__icon"></i>
                <ul id="${config.datalistId}__ul" slot="dropdown"></ul>
            </div>
            <div class="${config.ctrlButtons}">
                <span class="${config.ctrlButtons}__show fas fa-angle-down"></span>
                <span class="${config.ctrlButtons}__hide hidden fas fa-times"></span>
                <button class="${config.ctrlButtons}__clear-selection hidden">Clear selection</button>
            </div>
        </div>
    `
);

const getInputStyles = (config: {datalistId: string, ctrlButtons: string}): string => (`
    #${config.datalistId} {
        position: relative;
        color: #000;
    }

    #${config.datalistId}.active #${config.datalistId}__ul {
        display: block;
    }

    #${config.datalistId}__input {
        padding-left: 1em;
        width: 100%;
        height: 54px;
        border-radius: 5px;
        box-sizing: border-box;
        box-shadow: none;
        border: 1px solid #ccc;
        outline: 0;
    }

    #${config.datalistId}__input:focus {
        border: 1px solid #3288C1;
        outline: 0;
    }

    #${config.datalistId}__icon {
        position: absolute;
        right: 20px;
        top: 20px;
        transition: transform 0.2s ease;
    }

    #${config.datalistId}.active #${config.datalistId}__icon {
        transform: rotate(270deg);
    }

    #${config.datalistId}__ul {
        display: none;
        position: absolute;
        margin: 5px 0 0 0;
        padding: 0;
        width: 100%;
        max-height: 200px;
        top: 100%;
        left: 0;
        list-style: none;
        border-radius: 2px;
        background: #fff;
        overflow: hidden;
        overflow-y: auto;
        z-index: 100;
    }

    #${config.datalistId}__ul li {
        display: block;
        text-align: left;
        padding: 0.8em 1em 0.8em 1em;
        color: #3288C1;
        cursor: pointer;
        background: #E6F3FD;
        margin: 10px 20px;
        border-radius: 7px;
        border: #C7E0EE 2px solid;
        font-weight: 700;
    }

    #${config.datalistId}__ul li:hover,
    #${config.datalistId}__ul li.selected {
        background: #007DAF;
        color: #fff;
    }

    .${config.datalistId}__wrapper {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 10px;
    }

    .${config.ctrlButtons} {
        display: grid;
        grid-auto-flow: column;
        grid-gap: 5px;
        align-items: center;
        justify-content: left;
    }

    .${config.ctrlButtons} span.hidden,
    .${config.ctrlButtons} button.hidden {
        display: none;
    }

    .${config.ctrlButtons} span {
        padding: 4px;
        position: relative;
        border-radius: 50%;
        width: 15px;
        height: 15px;
        cursor: pointer;
    }
    .${config.ctrlButtons} button {
        padding: 10px;
        border: 2px solid #007DAF;
        cursor: pointer;
        background: #CCE4F7;
        color: #3995D1;
        font-weight: 700;
        border-radius: 5px;
    }

    .${config.ctrlButtons} span:before {
        left: 6px;
        top: 3px;
        position: absolute;
    }

    .${config.ctrlButtons} span:hover {
        background: #9E9E9E;
    }
`);

export {getInputTemplate, getInputStyles};