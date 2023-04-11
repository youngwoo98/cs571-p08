import { Text, View, Image, Button } from "react-native";
import { useContext, useEffect, useState } from "react";


export default function BadgerBakedGood(props) {

   /* const [order, setOrder] = useContext(DataContext) */
    
    
    
    const info = props[1]


    

    return (
        <View> 
        <Image
            style = {{
                alignSelf: 'center',
                width: 200,
                height: 200,
            }} 
            source = {{ uri: info['img']}}
        />
        <Text
            style = {{
                textAlign: 'center',
                fontSize: 40
            }}
        >{props[0]}</Text>
    <View/>
    <Text
        style = {{
            textAlign: 'center',
            fontSize: 20
        }}
        >${info["price"]}</Text>
    <Text
        style = {{
            textAlign: 'center',
            fontSize: 20
        }}
        >You can order up to {info['upperBound']} units!</Text>
  
    
        </View>
    )
}
