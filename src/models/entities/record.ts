// Design pattern: recursive associations
// https://web.csulb.edu/colleges/coe/cecs/dbdesign/dbdesign.php?page=recursive.php
// https://refactoring.guru/design-patterns/state
// https://stackoverflow.com/questions/19973203/strategy-pattern-with-different-parameters
// https://stackoverflow.com/questions/12140498/achieve-strategy-pattern-when-we-have-different-return-type
interface IEnrollment {
  id: number;
  referenceNo: string;
  producer: string;
  consumer: string;
  records: readonly IRecord[];
}

interface IRecord {
  id: number;
  driver: string;
  vehicle: IVehicle;
  event: string;
  description: string;
  load: number;
  records: IRecord[];
}

// enrollment: IEnrollment[];
interface IVehicle {
  name: string;
  fuel: number;
  capacity: number;
}

interface IEnrollmentService {
  get(referenceNo: string): Readonly<IEnrollment> | undefined;
  record(enrollment: IEnrollment, recordId: number): Readonly<IRecord>;
  create({
    referenceNo,
    producer,
    consumer,
  }: {
    referenceNo: string;
    producer: string;
    consumer: string;
  }): IEnrollment;
}

class EnrollmentService implements IEnrollmentService {
  private readonly enrollments: IEnrollment[] = [];

  get(referenceNo: string): Readonly<IEnrollment> | undefined {
    return this.enrollments.find((e) => e.referenceNo === referenceNo);
  }
  public record(enrollment: IEnrollment, recordId: number): Readonly<IRecord> {
    return enrollment.records.find((r) => r.id === recordId)!;
  }

  create({
    referenceNo,
    producer,
    consumer,
  }: {
    referenceNo: string;
    producer: string;
    consumer: string;
  }) {
    const enrollment = {
      referenceNo,
      id: this.enrollments.length + 1,
      consumer,
      producer,
      records: [],
    };
    this.enrollments.push(enrollment);
    return enrollment;
  }
}

export abstract class Executable<TResult, TArgs> {
  constructor(protected readonly enrollmentService: IEnrollmentService) {}
  abstract apply(args: TArgs): TResult;
}

export class ChangeDriver extends Executable<
  void,
  {
    referenceNo: string;
    recordId: number;
    readonly driver: string;
  }
> {
  constructor(enrollmentService: IEnrollmentService) {
    super(enrollmentService);
  }
  apply(args: {
    referenceNo: string;
    recordId: number;
    readonly driver: string;
  }): void {
    const enrollment = this.enrollmentService.get(args.referenceNo)!;
    const record = this.enrollmentService.record(enrollment, args.recordId);

    record.records.push({
      ...enrollment.records[enrollment.records.length],
      driver: args.driver,
    });
  }
}

class LoadFuel extends Executable<
  void,
  {
    recordId: number;
    referenceNo: string;
    readonly fuel: number;
  }
> {
  constructor(enrollmentService: IEnrollmentService) {
    super(enrollmentService);
  }

  apply(args: { referenceNo: string; recordId: number; fuel: number }): void {
    const enrollment = this.enrollmentService.get(args.referenceNo)!;
    const record = this.enrollmentService.record(enrollment, args.recordId);

    const { vehicle } = record;
    record.records.push({
      ...record,
      vehicle: {
        ...vehicle,
        fuel: vehicle.fuel + args.fuel,
      },
    });
  }
}
class TransferLoad extends Executable<
  void,
  {
    referenceNo: string;
    readonly vehicle: IVehicle;
    recordId: number;
  }
> {
  constructor(enrollmentService: IEnrollmentService) {
    super(enrollmentService);
  }
  apply(args: {
    referenceNo: string;
    recordId: number;
    vehicle: IVehicle;
  }): void {
    const enrollment = this.enrollmentService.get(args.referenceNo)!;
    const record = this.enrollmentService.record(enrollment, args.recordId);

    record.records.push({
      ...record,
      vehicle: args.vehicle,
    });
  }
}

class SegregateLoad extends Executable<
  void,
  {
    referenceNo: string;
    readonly load: number;
    recordId: number;
  }
> {
  constructor(enrollmentService: IEnrollmentService) {
    super(enrollmentService);
  }

  apply(args: { referenceNo: string; recordId: number; load: number }): void {
    const enrollment = this.enrollmentService.get(args.referenceNo)!;
    const record = this.enrollmentService.record(enrollment, args.recordId);

    record.records.push(
      {
        ...record,
        event: "segregate load",
        load: record.load - args.load,
      },
      {
        id: 133,
        driver: "Driver3",
        event: "shipment start",
        description: "",
        vehicle: { name: "Vehicle3", capacity: 1000, fuel: 100 },
        load: args.load,
        records: [],
      }
    );
  }
}

// class UI {
//   constructor(private readonly enrollmentService: IEnrollmentService) {}
//   handleClick() {
//     [new LoadFuel()].apply(this.enrollmentService);
//   }
// }

const enrollment: IEnrollment = {
  id: 1,
  referenceNo: "ABC123",
  producer: "Producer1",
  consumer: "Consumer1",
  records: [
    {
      id: 1,
      driver: "Driver1",
      description: "",
      event: "shipment start",
      vehicle: { name: "Vehicle1", capacity: 1000, fuel: 60 },
      load: 100,
      records: [
        {
          id: 1,
          driver: "Driver1",
          event: "fuel load",
          description: "",
          vehicle: { name: "Vehicle1", capacity: 1000, fuel: 120 },
          load: 100,
          records: [
            {
              id: 1,
              driver: "Driver1",
              description: "",
              event: "segregate load",
              vehicle: { name: "Vehicle1", capacity: 1000, fuel: 120 },
              load: 50,
              records: [
                {
                  id: 1,
                  driver: "Driver1",
                  description: "",
                  event: "shipment end",
                  vehicle: { name: "Vehicle1", capacity: 1000, fuel: 120 },
                  load: 50,
                  records: [],
                },
              ],
            },
            {
              id: 1,
              driver: "Driver3",
              event: "shipment start",
              description: "",
              vehicle: { name: "Vehicle3", capacity: 1000, fuel: 100 },
              load: 50,
              records: [
                {
                  id: 1,
                  driver: "Driver3",
                  event: "shipment end",
                  description: "",
                  vehicle: { name: "Vehicle3", capacity: 1000, fuel: 100 },
                  load: 50,
                  records: [],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 1,
      driver: "Driver2",
      description: "",
      event: "shipment start",
      vehicle: { name: "Vehicle2", capacity: 1000, fuel: 200 },
      load: 100,
      records: [
        {
          id: 1,
          driver: "Driver2",
          description: "",
          event: "shipment end",
          vehicle: { name: "Vehicle2", capacity: 1000, fuel: 200 },
          load: 100,
          records: [],
        },
      ],
    },
  ],
};

/*
interface IFoo {
  bass: IFoo[];
  baz: string;
}

const foo: IFoo = {
  bass: [{ bass: [{ bass: [], baz: "ok" }], baz: "ok" }],
  baz: "ok",
};

// readonly bass: IFoo[];
foo.bass = [];
foo.bass[0].bass = [];

// readonly baz: string;
foo.baz = "";
foo.bass[0].baz = "";

// bass: Readonly<IFoo>[];
foo.bass[0].bass = [];

// bass: readonly IFoo[];
// bass: Readonly<IFoo[]>
// bass: ReadonlyArray<IFoo>;
foo.bass[0] = { bass: [], baz: "" };
foo.bass.push({ bass: [], baz: "" });

let f = { a: "" } as const;
f = { a: "" };
f.a = "";


const x = { a: "", b: { c: "" } as const };
x.a = "";
x.b.c = "";
x.b = { c: "" };


const t: {
  readonly a: string;
  readonly b: { c: string };
} = { a: "", b: { c: "" } };
t.a = "";
t.b = { c: "" };
t.b.c = "";
*/
