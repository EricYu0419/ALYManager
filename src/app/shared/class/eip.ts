export class Vpc {
    CidrBlock: string;
    CreationTime: Date;
    Description: string;
    RegionId: string;
    Status: string;
    UserCidrs: Object;
    VRouterId: string;
    VSwitchIds: Object;
    VpcId: string;
    VpcName: string;
}

export class EipAddress {
    constructor(id: string, ip: string) {
        this.AllocationId = id;
        this.IpAddress = ip;
    }
    ChargeType: string;
    AllocationTime: Date;
    ResourceGroupId: string;
    InstanceId: string;
    Descritpion: string;
    IpAddress: string;
    AllocationId: string;
    InternetChargeType: string;
    InstanceType: string;
    Name: string;
    Status: string;
    BandwidthPackageId: string;
    InstanceRegionId: string;
    BandwidthPackageType: string;
    RegionId: string;
    OperationLocks: Object;
    ExpiredTime: Date;
    AvailableRegions: Object;
    Bandwidth: string;
}
