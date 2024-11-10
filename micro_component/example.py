import streamlit as st
import io
from micro_component import micro_component

# Add some test code to play with the component while it's in development.
# During development, we can run this just as we would any other Streamlit
# app: `$ streamlit run my_component/example.py`

st.subheader("Component with constant args")

template = ""
with io.open("micro_component/example-template/some-code.html") as theme:
    template = theme.read()

google = ""
with io.open("micro_component/example-template/google_auth.html") as theme:
    google = theme.read()
result = micro_component(template, title="Jinja2", body="this is jinja", key="some-code-test")
st.write(f"result is: {result}.")

micro_component(google, name="گوگل")
