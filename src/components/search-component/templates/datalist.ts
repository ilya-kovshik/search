const getDataListTemplate = (config: {datalistId: string, ctrlButtons: string}): string => (`
        <div class="${config.datalistId}__wrapper">
            <div id="${config.datalistId}">
                <input id="${config.datalistId}__input" type="text">
                <i id="${config.datalistId}__icon"></i>
                <ul id="${config.datalistId}__ul"></ul>
            </div>
            <div class="${config.ctrlButtons}">
                <input type="button" class="${config.ctrlButtons}__show" value="o" />
                <input type="button" class="${config.ctrlButtons}__hide hidden" value="x"/>
            </div>
        </div>
    `
);

const getDataListStyles = (config: {datalistId: string, ctrlButtons: string}): string => (`
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
        border: 1px solid #AA0000;
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
        color: #999;
        cursor: pointer;
    }

    #${config.datalistId}__ul li:hover {
        background: #4e00f0;
        color: #f00;
    }

    .${config.datalistId}__wrapper {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 10px;
    }

    .${config.ctrlButtons} {
        display: grid;
        grid-gap: 5px;
        align-items: center;
        justify-content: left;
    }

    .${config.ctrlButtons} input[type="button"].hidden {
        display: none;
    }
`);

export {getDataListTemplate, getDataListStyles};