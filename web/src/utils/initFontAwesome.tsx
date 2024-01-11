import {library} from "@fortawesome/fontawesome-svg-core";
import {
    faEnvelope,
    faPhone,
    faLocationDot,
    faPencil,
    faCamera,
    faGripLinesVertical,
} from "@fortawesome/free-solid-svg-icons" //from "@fortawesome/free-solid-svg-icons";

import {
    faHouse,
    faAddressBook,
    faCalendar,
    faList,
    faFile,
    faSpinner,
    faGear,
    faTrashCan,
    faRightFromBracket
} from "@fortawesome/pro-light-svg-icons"

function initFontAwesome() {
    library.add(faAddressBook)
    library.add(faEnvelope)
    library.add(faPhone)
    library.add(faLocationDot)
    library.add(faPencil)
    library.add(faCalendar)
    library.add(faCamera)
    library.add(faFile)
    library.add(faGripLinesVertical)
    library.add(faHouse)
    library.add(faList)
    library.add(faSpinner)
    library.add(faGear)
    library.add(faTrashCan)
    library.add(faRightFromBracket)
}

export default initFontAwesome;