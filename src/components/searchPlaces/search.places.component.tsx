import {AutoComplete} from "antd";
import React, {useEffect} from "react";
import usePlacesAutocomplete from "use-places-autocomplete";

type SearchPlacesProps = {
    onChange: (value: string) => void;
    onSelect: (value: string) => void;
    value?: string;
}

export const SearchPlaces: React.FC<SearchPlacesProps> = (props) => {
    const {onChange, onSelect, value} = props;
    const {
        value: placesAutocompleteValue,
        suggestions: {data},
        setValue,
    } = usePlacesAutocomplete({
        // requestOptions: {
        //     // @ts-ignore
        //     // location: {lat: () => 40.730610, lng: () => -73.935242},
        //     // origin: {lat: 40.730610, lng: -73.935242},
        //     // componentRestrictions: {country: 'us'},
        //     // location: new google.maps.LatLng(40.73,-73.93),
        //     // origin: new google.maps.LatLng(40.73,-73.93),
        //     radius: 100 * 100,
        //     language: 'en'
        // },
        debounce: 300
    });
    useEffect(() => {
        if(value) {setValue(value, true)}
    }, [value])
    const preparedData = data.map(({description}) => ({value: description, label: ''}))

    const onChangeHandler = (value: string) => {
        console.log('onChangeHandler', value)
        setValue(value, true);
        onChange(value);
    }

    const onSelectHandler = (value: string) => {
        setValue(value, false)
        onSelect(value);
    }

    return (
        <AutoComplete options={preparedData}
                      allowClear
                      onClear={() => onChangeHandler('')}
                      onSelect={onSelectHandler}
                      onSearch={onChangeHandler}
                      value={placesAutocompleteValue || value}
                      placeholder='1299 Ocean ave, Brooklyn'
        />
    )
};