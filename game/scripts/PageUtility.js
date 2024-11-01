const loadedStyles = new Map();

export function addStyle(filename)
{
    const style = document.createElement("link");
    style.setAttribute("rel", "stylesheet");
    style.setAttribute("href", `./game/styles/${filename}.css`);
    style.setAttribute("id", `${filename}`);
    document.head.appendChild(style);

    loadedStyles.set(filename, style);
}

export function removeStyle(filename)
{
    loadedStyles.delete(filename);
    $(`#${filename}`).remove();
}