function getDataListTemplate(config: {datalistId: string, datalistWrapperClassName: string}): string {
    return `
        <div class="${config.datalistWrapperClassName}">
            <input list="${config.datalistId}" class="${config.datalistWrapperClassName}__input">
            <datalist id="${config.datalistId}" class="${config.datalistWrapperClassName}__datalist">
            </datalist>
        </div>
    `;
}

export {getDataListTemplate};