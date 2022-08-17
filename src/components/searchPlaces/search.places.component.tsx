import {AutoComplete} from "antd";
import React, {useEffect} from "react";
import usePlacesAutocomplete, {getLatLng} from "use-places-autocomplete";

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
        requestOptions: {
            // @ts-ignore
            // location: {lat: () => 40.730610, lng: () => -73.935242},
            // origin: {lat: 40.730610, lng: -73.935242},
            componentRestrictions: {country: 'us'},
            // location: new google.maps.LatLng({lat: 40.730610, lng: -73.935242}),
            // origin: new google.maps.LatLng(40.73,-73.93),
            // language: 'en'
        },
        debounce: 300
    });
    useEffect(() => {
        if(value) {setValue(value, true)}
    }, [value])
    const preparedData = data.reduce((result:any, {description}) => {
        if(
            !description.includes('Brooklyn') &&
            !description.includes('Queens') &&
            !description.includes('Manhattan') &&
            !description.includes('Bronx') &&
            !description.includes('New York')
        ) return result;
        else result.push({value: description, label: ''})
        return result;
    }, [])
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