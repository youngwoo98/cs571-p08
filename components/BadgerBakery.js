import { Button, Text, View } from "react-native";
import BadgerBakedGood from "./BadgerBakedGood";
import { useContext, useEffect, useState } from "react";
import BakeryOrderContext from "../contexts/BakeryOrderContext";

export default function BadgerBakery() {

    const [order, setOrder] = useState({});

    const [goods, setGoods] = useState({});
    const [nextButton, setNextButton] = useState(false);
    const [prevButton, setPrevButton] = useState(true);

    const [incButton, setIncButton] = useState(false);
    const [decButton, setDecButton] = useState(true);

    const [total, setTotal] = useState(0);
    
    const [flag, setFlag] = useState(0);

    const [count, setCount] = useState(0);


    const [pg, setPg] = useState(0);

    useEffect(() => {
        fetch(`https://www.cs571.org/s23/hw8/api/bakery/items`, {
            method: "GET",
            headers: {
                "X-CS571-ID": "bid_c49825b5bd469d794555"
            }
        })
        .then((response) => response.json())
        .then((data) => {
            setGoods(data);
        })
        .catch(error => console.error(error));
    }, [])

   
    useEffect(() => {
        temp = {}
        Object.keys(goods).map(key => {
            temp[key] = 0
        })
        setOrder(temp)
        setFlag(0)
    }, [goods, flag])


    const porder = () => {
        fetch(`https://www.cs571.org/s23/hw8/api/bakery/order`, {
            method: `POST`,
            headers:{
                "Content-Type": "application/json",
                "X-CS571-ID": "bid_c49825b5bd469d794555",
            },
            body: JSON.stringify(
                order
            )
        }).then(res => {
            console.log(res.status)
            if(res.status === 200){
                alert("Successfully placed order!")
            }
            else if(res.status === 418){
                alert("Something went wrong!")
            }
        }).then(
            setFlag(1),
            setCount(0),
            setTotal(0),
            setIncButton(false),
            setDecButton(true)
        );
    } 


    function bringCount(type){

        let bake = ''
        if(type === 'n'){
            bake = Object.keys(goods)[pg+1]
        }
        else if(type === 'p'){
            bake = Object.keys(goods)[pg-1]
        }
        console.log(bake)
        console.log(order[bake])
        if(order[bake] !== 0){
            setCount(order[bake])
        }
        else{
            order[bake] = 0
            setCount(0)
        }
    }

    const changeCount = (key, num) => {
        const temp2 = order
        temp2[key] = num;
        setOrder(temp2)
    }


    function next() {
        setPg(pg + 1);
        if(pg === Object.keys(goods).length - 2){
            setNextButton(true);
        }
        if(pg === 0){
            setPrevButton(false);
        }
        bringCount('n')
        checkVis('n')
    }

    function prev() {
        setPg(pg - 1);
        if(pg === 1){
            setPrevButton(true);
        }
        if(pg === Object.keys(goods).length - 1){
            setNextButton(false);
        }
        bringCount('p')
        checkVis('p')
    }

    function checkVis(type) {
        let tempC = 0;
        if(type === 'p'){
            tempC = Object.values(order)[pg - 1]
            console.log(tempC)
            if(tempC === 0){
                setDecButton(true)
            }
            else if (tempC !== 0){
                setDecButton(false)
            }
            if(tempC === Object.values(goods)[pg - 1]['upperBound']){
                setIncButton(true)
            }
            else if (tempC < Object.values(goods)[pg - 1]['upperBound']){
                setIncButton(false)
            }
        }
        else if(type === 'n'){
            tempC = Object.values(order)[pg + 1]
            console.log(tempC+'tempc')
            if(tempC === 0){
                setDecButton(true)
            }
            else if(tempC !== 0){
                setDecButton(false)
            }
            if(tempC === Object.values(goods)[pg + 1]['upperBound']){
                setIncButton(true)
            }
            else if (tempC < Object.values(goods)[pg + 1]['upperBound']){
                setIncButton(false)
            }
        }
    }

    function inc() {
        setCount(count + 1);
        if(count === Object.values(goods)[pg]['upperBound'] - 1){
            setIncButton(true);
        }
        if(count === 0){
            setDecButton(false);
        }
        changeCount(Object.keys(goods)[pg], count+1)
        setTotal(total + Object.values(goods)[pg]['price'])
    }

    function dec() {
        setCount(count - 1);
        if(count === 1){
            setDecButton(true);
        }
        if(count === Object.values(goods)[pg][`upperBound`]){
            setIncButton(false);
        }
        changeCount(Object.keys(goods)[pg], count-1)
        setTotal(total - Object.values(goods)[pg]['price'])
    }



    return (
        <BakeryOrderContext.Provider value = {[order, setOrder]}>
            <View>  
                <Text style={{
                    alignSelf: 'center'
                }}>Welcome to Badger Bakery!</Text>
                <View style={{
                    flexDirection: 'row',
                    alignSelf: 'center'
                }}>
                    <Button 
                        title='PREVIOUS'
                        onPress={() => {
                            prev()
                            checkVis()
                        }}
                        disabled={prevButton}
                    />
                    <Button 
                        title='NEXT'
                        onPress={() => {
                            next()
                            checkVis()
                        }}
                        disabled={nextButton}
                    />
                </View>
                {
                    Object.keys(goods).length === 0 ?
                    <Text>Loading...</Text>
                    :
                    <BadgerBakedGood {...Object.entries(goods)[pg]}/>
                }  
                <View 
                    style={{
                        padding: 10
                    }}/>
                <View style={{
                    flexDirection: 'row',
                    alignSelf: 'center'
                }}>
                    <Button 
                        title='-'
                        onPress={() => dec()}
                        disabled={decButton}
                    />
                    <Text>{count}</Text>
                    <Button 
                        title='+'
                        onPress={() => inc()}
                        disabled={incButton}
                    />
                </View>
                <Text style={{
                    alignSelf: 'center'
                }}>Order Total: ${total}</Text>
                <Button
                    title={'PLACE ORDER'}
                    onPress={() => porder()}
                />
            </View>
        </BakeryOrderContext.Provider>
    )
}
