import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import 'leaflet/dist/leaflet.css';

import { mapEditSelector, positionSelector } from '../../redux/selectors';
import mapSlice from './mapSlice';

function LocationMarker() {
    const dispatch = useDispatch()
    const position = useSelector(positionSelector)
    const edit = useSelector(mapEditSelector)

    console.log("re-render");

    const map = useMapEvents({
        click(e) {
            if (edit) {
                dispatch(mapSlice.actions.setPosition({ ...e.latlng }))
            }
        },
        locationfound(e) {
            dispatch(mapSlice.actions.setPosition({ ...e.latlng }))
        },
    });

    useEffect(() => {
        if (!position) {
            map.locate();
        } else {
            map.setView(position, map.getZoom());
        }
    }, [position]);

    return (
        <>
            {position && ( // Kiểm tra nếu position không null trước khi sử dụng
                <Marker position={position}>
                    <Popup>Bạn đã chọn ở đây</Popup>
                </Marker>
            )}
        </>
    );
}

const MapPicker = () => {

    console.log("re-render");

    return (
        <div style={{ height: '400px', width: '100%' }} className='border shadow-lg my-2'>
            <MapContainer
                center={{ lat: 51.505, lng: -0.09 }}
                zoom={16}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker />
            </MapContainer>
        </div>
    );
};

export default React.memo(MapPicker);
