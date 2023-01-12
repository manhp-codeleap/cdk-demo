import { Box } from '@mui/material'
import React from 'react'
import { ThreeCircles } from 'react-loader-spinner'
import { useQuery } from 'react-query'
import { ItemImage } from './ItemImage';

interface ItemData {
    id: number;
    title: string;
    image: string;
    price: number;
}

export interface ItemListProps {

}

export const ItemOverview: React.FC<ItemData> = (props) => {
    return <Box display='flex' flexDirection='row' width={.3}>
        <Box height={.9}><ItemImage url={props.image}/></Box>
        <Box height={.1} display='flex' flexDirection='row'>
            <Box width={.8}>{props.title}</Box>
            <Box width={.2}>{props.price}</Box>
        </Box>
    </Box>
}

export const ItemList: React.FC<ItemListProps> = (props) => {
    const {isLoading, isError, error, data } = useQuery('item-lists', {
        queryFn: async ()=> {
            await new Promise((res) => setTimeout(res, 2000))
            // hardcode for now
            return [
                {
                    "id": 1,
                    "title": "Google Pixel 3",
                    "image": "/media/img/phone_1-min.jpg",
                    "price": 799.00
                },
                {
                    "id": 2,
                    "title": "Samsung Note 9",
                    "image": "/media/img/phone_2-min.jpg", // static url
                    "price": 999.00
                }
            ]
        }
    })

    if (isLoading)
        return <Box>
          <ThreeCircles
  height="100"
  width="100"
  color="#4fa94d"
  wrapperStyle={{}}
  wrapperClass=""
  visible={true}
  ariaLabel="three-circles-rotating"
  outerCircleColor=""
  innerCircleColor=""
  middleCircleColor=""
/></Box>

// display error here
// if (isError) return 

// display list of product
return <Box width={1} display='flex' flexDirection='row'>
{
    data?.map(item =>(<ItemOverview {...item} key={item.id}/>))
}
</Box>
}