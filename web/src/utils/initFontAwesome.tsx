import {library} from "@fortawesome/fontawesome-svg-core";
import {
    faHome,
    faAddressBook,
    faEnvelope,
    faPhone,
    faLocationDot,
    faPencil,
    faCalendar, faCamera, faFile
} from "@fortawesome/free-solid-svg-icons";

function initFontAwesome() {
    library.add(faHome)
    library.add(faAddressBook)
    library.add(faEnvelope)
    library.add(faPhone)
    library.add(faLocationDot)
    library.add(faPencil)
    library.add(faCalendar)
    library.add(faCamera)
    library.add(faFile)
}

export default initFontAwesome;