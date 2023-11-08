import {library} from "@fortawesome/fontawesome-svg-core";
import {faHome, faAddressBook} from "@fortawesome/free-solid-svg-icons";

function initFontAwesome() {
    library.add(faHome)
    library.add(faAddressBook)
}

export default initFontAwesome;