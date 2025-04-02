import { connectRabbitMQ } from "./rabbitmq";
export const sendMessage = async (queue: any, body: any) => {
    const {channel} = await connectRabbitMQ();
    await channel.assertQueue(queue, { durable: true });
    const message = { orderId: body._id, status: "Order Placed" };
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
    console.log(`✅ Sent message: ${JSON.stringify(message)}`);
    // setTimeout(() => channel.close(), 500);
};

