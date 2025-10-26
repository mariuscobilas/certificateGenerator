import React from 'react';

export type TextBoxProps = {
    id: string;
    text: string;
    fontSize: number;
    fontFamily: string;
    fontWeight: number;
}

const TextBox= (props:TextBoxProps) => {
    const id = props.id;
    const text= props.text;
    const fontSize = props.fontSize;
    const fontFamily = props.fontFamily;
    const fontWeight = props.fontWeight;


    return (
        <div id={id} key={id} className="px-3 py-2 bg-card-foreground rounded-lg" style={{fontSize:fontSize, fontWeight:fontWeight,  fontFamily:fontFamily}}>
            {text}
        </div>
    );
};

export default TextBox;