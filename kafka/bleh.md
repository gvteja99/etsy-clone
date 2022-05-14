bin/zookeeper-server-start.sh config/zookeeper.properties
bin/kafka-server-start.sh config/server.properties
bin/kafka-topics.sh --create --topic addfavourite --bootstrap-server localhost:9092
bin/kafka-topics.sh --create --topic response_topic --bootstrap-server localhost:9092


bin/kafka-console-producer.sh --topic addfavourite --bootstrap-server localhost:9092
bin/kafka-console-consumer.sh --topic addfavourite --from-beginning --bootstrap-server localhost:9092
bin/kafka-console-producer.sh --topic response_topic --bootstrap-server localhost:9092
bin/kafka-console-consumer.sh --topic response_topic --from-beginning --bootstrap-server localhost:9092



bin/kafka-topics.sh --create --zookeeper localhost:2181 replication-factor 1 --partitions 1 --topic response_topic
bin/kafka-topics.sh --create --zookeeper localhost:2181 replication-factor 1 --partitions 1 --topic addfavourite


//   const id = req.params.id;
//   let uniqueOrderId = Math.floor(Math.random() * 1000000)

//   console.log("updating purchase")
//   CartModel.updateMany({ userId: id , purchase: 0}, { $set: {orderId: uniqueOrderId, purchase: 1 } }, (err, result) => {
//     if (err) {
//       console.log("couldnt update")
//       console.log(err);
//     } else {
//       console.log(result);
//       // res.send(result);
//       res.send("purchase updated");
//       console.log("qty update")
//     }
//   }

//   );
// });