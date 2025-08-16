// kafka.service.ts
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Kafka } from 'kafkajs';

@Injectable()
export class KafkaProducerService  {
  constructor(@Inject('HERO_SERVICE') private readonly client: ClientKafka) {}
  // private kafka = new Kafka({
  //   brokers: ['kafka:9092'],
  // });

  // private producer = this.kafka.producer();

  // async onModuleInit() {
  //   await this.producer.connect();
  // }

   // Wait until Kafka is ready before sending messages
  async onModuleInit() {
    this.client.subscribeToResponseOf('hero.create');
    await this.client.connect();
  }

  async sendMessage(topic: string, message: any) {
    this.client.emit('hero.create', {name: 'gourav'})
    .subscribe({
      next: (val ) => {
        console.log('***** send Message *********')
        console.log(val)
      },
      error: (err) => {
        console.log('***** send Message *********')
        console.log(err)
      }
    })
    // await this.producer.send({
    //   topic,
    //   messages: [{ value: JSON.stringify(message) }],
    // });
  }
}
