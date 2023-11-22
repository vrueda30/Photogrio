import {Row} from "reactstrap";
import {Avatar} from "@files-ui/react";
import './components.css'
import {CSSProperties, useEffect, useState} from "react";

export interface ProfileFile{
    name: string;
    file: File;
    url: string
}
export interface ProfileProps {
    callback: (file:ProfileFile) => void;
    imageSource?: string | undefined | globalThis.File;
}

const  ProfileImage = (props:ProfileProps) => {

    return(
        <div className="w-100">
            <Row className="w-100 justify-content-center">
                <Avatar src={props.imageSource} variant="circle"
                        style={{width:100, height:100} as CSSProperties}
                        onChange={async (r) => {
                            const profile = {
                                name: r.name,
                                file: r,
                                url:""
                            }
                            props.callback(profile)
                }} accept="image/*"/>
            </Row>
            <Row className="d-flex w-100">

            </Row>
        </div>
    )
}

export default ProfileImage