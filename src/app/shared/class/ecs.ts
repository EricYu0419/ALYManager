import { EipAddress } from ".";

export class Zone {
    ZoneId: string;
    LocalName: string;
}
export class Image {
    Architecture: string;
    Description: string;
    DiskDeviceMappings: { DiskDeviceMapping: Array<string> };
    ImageId: string;
    ImageName: string;
    ImageOwnerAlias: string;
    ImageVersion: string;
    IsCopied: boolean;
    IsSelfShared: string;
    IsSubscribed: boolean;
    IsSupportCloudinit: boolean;
    IsSupportIoOptimized: boolean;
    OSName: string;
    OSType: string;
    Platform: string;
    ProductCode: string;
    Progress: string;
    Size: number;
    Status: string;
}
export class Disk {
    DiskId: string;
    RegionId: string;
    InstanceId: string;
}
export class Region {
    RegionId: string;
    LocalName: string;
    RegionData: {
        Zones: Array<Zone>;
        Images: Array<Image>;
        Disks: Array<Disk>;
        InstanceTypes: Array<InstanceType>;
        EipAddresses:Array<EipAddress>;
    };
}

export class InstanceType {
    InstanceTypeFamily: string;
    InstanceTypeId: string;
    GPUAmount: number;
    GPUSpec: string;
    EniQuantity: number;
    CpuCoreCount: number;
    MemorySize: number;
    LocalStroageCategory: string;
}

export class Instance {
    InstanceId: string;
    RegionId: string;
    ZoneId: string;
    ImageId: string;
    InstanceName: string;
    HostName: string;
    InstanceType: string;
    Status: string;
    Cpu: string;
    Memory: string;
    EipAddress: {
        IpAddress: string;
        AllocationId: string;
    };
    PublicIpAddress: {
        IpAddress: Array<string>;
    };
    VpcAttributes: {
        PrivateIpAddress: {
            IpAddress: Array<string>;
        };
    };
    InstanceNetworkType: string;
    InstanceChargeType: string;
    InternatChargeType: string;
    CreationTime: Date;
    ExpiredTime: Date;
    StartTime: Date;
    Disks: Array<Disk>;
    IsEip: boolean;
    HasPublicIp: boolean;
}

export class InstanceChargeType {
    Id: string;
    LocalName: string;
}
