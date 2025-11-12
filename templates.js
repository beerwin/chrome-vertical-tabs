export const fromTemplate = (template, placeholders) => {
    let preparedTemplate = template;
    for (const key in placeholders) {
        const re = String.raw`{${key}}`;
        const regex = new RegExp(re, 'gi');
        preparedTemplate = preparedTemplate.replace(regex, placeholders[key]);
    }
    
    const templateContainer = document.createElement('div');
    templateContainer.innerHTML = preparedTemplate;
    return templateContainer.firstElementChild;
}