import { Streamlit, RenderData } from "streamlit-component-lib"

// Add text and a button to the DOM. (You could also add these directly
// to index.html.)
const script = document.head.appendChild(document.createElement("script"))
const result = document.body.appendChild(document.createElement("div"))
result.style.setProperty("display", "none")
result.click = function(): void {
  Streamlit.setComponentValue(result.innerText)
}


const div = document.body.appendChild(document.createElement("div"))

/**
 * The component's render function. This will be called immediately after
 * the component is initially loaded, and then again every time the
 * component gets new data from Python.
 */

function onRender(event: Event): void {
  // Get the RenderData from the event



  const data = (event as CustomEvent<RenderData>).detail

  result.id = data.args["key"] + "-result"
  
  script.innerHTML = `
    function setValue(value){
      document.getElementById('${result.id}').innerText = value
      document.getElementById('${result.id}')?.click()
        }
    ${data.args["script"]??""}
        `
  // Maintain compatibility with older versions of Streamlit that don't send
  // a theme object.
  if (data.theme) {
    // Use CSS vars to style our button border. Alternatively, the theme style
    // is defined in the data.theme object.
    div.style.color = data.theme.textColor
    div.style.backgroundColor = data.theme.backgroundColor
  }

  // RenderData.args is the JSON dictionary of arguments sent from the
  // Python script.
  let key = data.args["key"]

  let content = data.args["content"]

  if (data.theme)
  {
    Object.entries(data.theme!)?.forEach(themeItem => {
      var tag = `##${themeItem[0]}##`;
      var re = new RegExp(tag, 'g');

      content = content.replace(re, themeItem[1]);
    });
  }
  div.childNodes.forEach(child => {
    div.removeChild(child)
  });
  
  div.innerHTML = content
  // Show "Hello, name!" with a non-breaking space afterwards.
  //textNode.textContent = `Hello, ${name}! ` + String.fromCharCode(160)

  // We tell Streamlit to update our frameHeight after each render event, in
  // case it has changed. (This isn't strictly necessary for the example
  // because our height stays fixed, but this is a low-cost function, so
  // there's no harm in doing it redundantly.)
  
  let body = document.getElementsByTagName("body")[0]
  
  Streamlit.setFrameHeight(body.clientHeight)
}

// Attach our `onRender` handler to Streamlit's render event.
Streamlit.events.addEventListener(Streamlit.RENDER_EVENT, onRender)

// Tell Streamlit we're ready to start receiving data. We won't get our
// first RENDER_EVENT until we call this function.
Streamlit.setComponentReady()

// Finally, tell Streamlit to update our initial height. We omit the
// `height` parameter here to have it default to our scrollHeight.
Streamlit.setFrameHeight()
