import {
  MinusOutlined,
  PlusOutlined
} from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  TimePicker,
  Typography,
  notification
} from "antd";
import { useForm } from "antd/es/form/Form";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ButtonBack } from "../components/buttonBack.component";
import { InputPhoneNumber } from "../components/inputPhoneNumber.component";
import { Preloader } from "../components/preloader.component";
import { SearchPlaces } from "../components/searchPlaces.component";
import { COLORS, ROUTES } from "../configs/app.constants";
import { VALIDATION_CONFIG } from "../configs/validation.config";
import { useAppSelector } from "../hooks/useAppSelector";
import {
  useCountOrderPriceAndDurationMutation,
  useCreateOrderMutation,
  useLazyGetOrderQuery,
  useUpdateOrderMutation,
} from "../store/reducers/backend/backend.api";
import {
  DeliveryTypeEnum,
  OrderType,
  PackageWeightEnum,
  PayTypeEnum
} from "../store/reducers/backend/backend.api.types";
// import moment from "moment";

export type InitialOrderStateType = Pick<
  OrderType,
  | "deliveryType"
  | "weight"
  | "deliveryPrice"
  | "payType"
  | "packageType"
  | "packagePrice"
>;

export function CreateScreen() {
  const { orderId } = useParams();
  const IS_UPDATE_ORDER_PAGE = !!orderId;
  const IS_AUTH_USER = useAppSelector(({ app }) => app.auth);
  const pickupPhoneNumber = useAppSelector(({ settings }) => settings.phone);
  // const { state }: any = useLocation();
  // const { pickupAddress = undefined, deliveryAddress = undefined } =
  //   state || {};
  // const IS_FORM_START_PAGE = pickupAddress && deliveryAddress;
  const navigate = useNavigate();

  // const carouselRef = useRef<CarouselRef>(null)
  const [orderPrice, setOrderPriceState] = useState(0);
  const [orderForm] = useForm();


  useEffect(() => {
    if (IS_UPDATE_ORDER_PAGE) {
      fetchGetOrder(Number(orderId))
        .unwrap()
        .then((data) => {
          console.log(data, "DATA");
          const {comment, deliveryPrice, points} = data;
          setOrderPriceState(deliveryPrice);
          orderForm.setFieldsValue({comment, points: points.map(point => ({
            ...point,
            date: moment(point.date),
            timeRange: [
              moment(point.timeRangeFrom),
              moment(point.timeRangeTo),
            ],
          }))});
        });
    }
  }, []);

  const [fetchGetOrder, { isFetching: fetchingGetOrder = false }] =
    useLazyGetOrderQuery();
  const [
    fetchCountOrderPriceAndDuration,
    { isLoading: fetchingCountOrderPriceAndDuration },
  ] = useCountOrderPriceAndDurationMutation();
  const [fetchCreateOrder, { isLoading: fetchingCreateOrder }] =
    useCreateOrderMutation();
  const [fetchUpdateOrder, { isLoading: fetchingUpdateOrder }] =
    useUpdateOrderMutation();

  const onFinishFormHandler = async ({ comment, points }) => {
    try {
      const data = {
        deliveryType: DeliveryTypeEnum.Walking,
        weight: PackageWeightEnum.Under1,
        payType: PayTypeEnum.SenderCash,
        packagePrice: 0,
        packageType: "",
        comment,
        points: points.map((point) => ({
          ...point,
          timeRangeFrom: point.timeRange[0],
          timeRangeTo: point.timeRange[1],
        })),
      };
    
      if (IS_UPDATE_ORDER_PAGE) {
        await fetchUpdateOrder({
          orderId: Number(orderId),
          update: data,
        }).unwrap();
        navigate(ROUTES.LIST_ORDERS + `/${orderId}`);
      } else {
        await fetchCreateOrder(data).unwrap();
        navigate(ROUTES.LIST_ORDERS);
      }
      
    } catch ({data: {message = ""} = {}}:any) {
      notification.error({ message: message as string });
      return;
    }
  };

  const isFilledAddress = (value: string) => {
    return value?.includes("USA") && value?.length > 10;
  };
  const onFormsValuesChangeHandler = (changedFields: any) => {
    const [{ errors, name, value }] = changedFields;
    console.log(changedFields);
    
    if (changedFields.length > 1 || !name.includes("address") || errors.length) return;
    if (isFilledAddress(value)) {
      const { points } = orderForm.getFieldsValue();
      const isUnFilled = points.find((point) => !isFilledAddress(point.address));
      if (!isUnFilled) {
        console.log("GET PRICE")
        onFetchCountOrderPriceAndDuration()
      }
    
    }
  };

  const onFetchCountOrderPriceAndDuration = () => {
    const { points } = orderForm.getFieldsValue();
    const [pickupPoint, ...deliveryPoints] = points.map(point => point.address)
    if (!fetchingCountOrderPriceAndDuration) {
      fetchCountOrderPriceAndDuration({
        origins: pickupPoint,
        destinations: deliveryPoints,
      })
        .unwrap()
        .then(({ price }) => {
          setOrderPriceState(price);
        });
    }
  }

  return (
    <>
       {IS_UPDATE_ORDER_PAGE && fetchingGetOrder && <Preloader type={"fullscreen"} />}
      <Row
        style={{ alignItems: "center", marginBottom: 20 }}
        justify={"space-between"}
      >
        {IS_UPDATE_ORDER_PAGE && <ButtonBack onClick={() => navigate(-1)} />}
        <Typography.Title style={{ marginBottom: 0 }} level={2}>
          {IS_UPDATE_ORDER_PAGE ? `Correct #${orderId}` : "Create"}
        </Typography.Title>
      </Row>
      <Form
        form={orderForm}
        name="order"
        onFinish={onFinishFormHandler}
        onFieldsChange={onFormsValuesChangeHandler}
        onFinishFailed={() =>
          notification.error({ message: "Fill all fields please!" })
        }
        autoComplete="off"
      >
        <Form.List
          name="points"
          initialValue={[
            { address: "", phone: pickupPhoneNumber },
            { address: "" },
          ]}
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Row key={key} style={{ marginBottom: 10 }}>
                  <Row
                    style={{
                      width: "100%",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                    justify={"space-between"}
                  >
                    <Form.Item
                      style={{ display: "none" }}
                      {...restField}
                      name={[name, "orderPointType"]}
                      initialValue={name === 0 ? "Pickup" : "Delivery"}
                    ></Form.Item>
                    <Typography.Title style={{ margin: 0 }} level={4}>
                      {name === 0 ? "Pickup" : "Delivery"} location
                    </Typography.Title>
                    {/* </Col> */}
                    {name > 1 && (
                      <Col span={5}>
                        <Button
                          onClick={() => {remove(name); onFetchCountOrderPriceAndDuration()}}
                          icon={<MinusOutlined />}
                        />
                      </Col>
                    )}
                  </Row>
                  <Form.Item
                    label={"Enter the address"}
                    rules={VALIDATION_CONFIG.address}
                    style={{ width: "100%" }}
                    hasFeedback
                    {...restField}
                    name={[name, "address"]}
                  >
                    <SearchPlaces
                      placeholder={"1556 Broadway, New York, 10120, USA"}
                    />
                  </Form.Item>
                  <Row style={{ width: "100%" }} justify={"space-between"}>
                    <Form.Item
                      validateTrigger={"onBlur"}
                      rules={VALIDATION_CONFIG.phone}
                      style={{ width: "100%" }}
                      label={"Phone number"}
                      hasFeedback
                      {...restField}
                      name={[name, "phone"]}
                      // name="phone"
                    >
                      <InputPhoneNumber />
                    </Form.Item>
                  </Row>
                  <Row justify={"space-between"}>
                    <Form.Item
                      rules={VALIDATION_CONFIG.date}
                      style={{ width: "35%" }}
                      label={"Date"}
                      hasFeedback
                      {...restField}
                      name={[name, "date"]}
                      initialValue={moment()}
                      // name="date"
                    >
                      <DatePicker
                        // defaultValue={moment()}
                        format={"MM/DD"}
                        disabledDate={(cur) => cur && cur < moment().subtract(1, "days")}
                      />
                    </Form.Item>
                    <Form.Item
                      rules={VALIDATION_CONFIG.timeRange}
                      style={{ width: "63%" }}
                      label={"Pick the time"}
                      hasFeedback
                      {...restField}
                      name={[name, "timeRange"]}
                      initialValue={[moment(), moment().add(5, "hours")]}
                    >
                      <TimePicker.RangePicker
                        format={"h A"}
                        use12Hours={true}
                      />
                    </Form.Item>
                  </Row>
                </Row>
              ))}

              {fields.length <= 10 && (
                <Form.Item style={{ marginBottom: 20 }}>
                  <Button onClick={() => add()} block icon={<PlusOutlined />}>
                    Add location
                  </Button>
                </Form.Item>
              )}
            </>
          )}
        </Form.List>
        <Row style={{ marginBottom: 25 }}>
          <Typography.Title level={4}>Comment for the Courier</Typography.Title>
          <Form.Item style={{ width: "100%" }} name="comment">
            <Input.TextArea
              placeholder={"Add comments for the courier"}
              rows={4}
            />
          </Form.Item>
        </Row>
        <Divider style={{ borderColor: "black" }} dashed={true} />
        <Row justify={"space-between"}>
          <Col span={11}>
            <Typography.Title style={{ margin: 0 }} level={2}>
              Total
            </Typography.Title>
          </Col>
          <Col span={11}>
            <Typography.Title
              style={{ textAlign: "right", color: COLORS.SUCCESS, margin: 0 }}
              level={2}
            >
              ${orderPrice}
            </Typography.Title>
          </Col>
        </Row>
        <Divider style={{ borderColor: "black" }} dashed={true} />
        <Row>
          <Button
            loading={fetchingUpdateOrder || fetchingCreateOrder || fetchingCountOrderPriceAndDuration}
            size={"large"}
            htmlType="submit"
          >
            {IS_AUTH_USER
              ? IS_UPDATE_ORDER_PAGE
                ? "Correct order"
                : "Create order"
              : "Next"}
          </Button>
        </Row>
      </Form>
    </>
  );
}
