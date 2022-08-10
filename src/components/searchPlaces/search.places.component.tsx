import {AutoComplete} from "antd";
import React from "react";
import usePlacesAutocomplete from "use-places-autocomplete";
import {SelectHandler} from "rc-select/lib/Select";

type SearchPlacesProps = {
    onChange: (value: string) => void;
    onSelect: (value: string) => void;
}

export const SearchPlaces: React.FC<SearchPlacesProps> = (props) => {
    const {onChange, onSelect} = props;
    const {
        value,
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
    const preparedData = data.map(({description}) => ({value: description, label: ''}))

    const onChangeHandler = (value: string) => {
        setValue(value, true);
        onChange(value);
    }

    const onSelectHandler = (value: string) => {
        setValue(value, false)
        onSelect(value);
    }

    return (
        <AutoComplete options={preparedData}
                      onSelect={onSelectHandler}
                      onSearch={onChangeHandler}
                      value={value}
                      placeholder='1299 Ocean ave, Brooklyn'
        />
    )
};