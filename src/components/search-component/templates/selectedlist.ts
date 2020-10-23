import {ISearchComponentNames} from "../../../interfaces/ISearchComponentNames";

const getSelectedListTemplate: (config: ISearchComponentNames) => string = (config): string => `
    <ul id="${config.selectedListId}">
        <li data-id="all">All</li>
    </ul>
`;

const getSelectedListStyles: (config: ISearchComponentNames) => string = (config): string => `
    #${config.selectedListId} {
        list-style: none;
        padding: 10px;
        border: 1px solid;
        border-radius: 5px;
    }

    #${config.selectedListId} li {
        border: 1px solid;
        padding: 5px;
        border-radius: 5px;
        margin: 10px;
    }

    #${config.selectedListId} li.hidden {
        display: none;
    }
`;

export {getSelectedListTemplate, getSelectedListStyles};