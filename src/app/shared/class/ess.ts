export class ScalingGroup {
    ScalingGroupId: string;
    ScalingGroupName: string;
    RegionId: string;
    ActiveScalingConfigurationId: string;
    CreationTime: Date;
    DBInstanceIds: Object;
    DefaultCooldown: number;
    LifecycleState: string;
    LoadBalancerIds: Object;
    MaxSize: number;
    MinSize: number;
    PendingCapacity: number;
    RemovalPolicies: Object;
    RemovingCapacity: number;
    TotalCapacity: number;
    VSwitchId: string;
    ActiveScalingConfiguration: ScalingConfiguration;
    Rules: Array<ScalingRule>;
}

export class ScalingConfiguration {
    CreationTime: Date;
    DataDisks: Object;
    ImageId: string;
    InstanceGeneration: string;
    InstanceName: string;
    InstanceType: string;
    InstanceTypes: Object;
    InternetChargeType: string;
    InternetMaxBandwidthIn: number;
    InternetMaxBandwidthOut: number;
    IoOptimized: string;
    LifecycleState: string;
    LoadBalancerWeight: number;
    ScalingConfigurationId: string;
    ScalingConfigurationName: string;
    ScalingGroupId: string;
    SecurityGroupId: string;
    SystemDiskCategory: string;
    SystemDiskSize: number;
}

export class ScalingRule {
    ScalingRuleId: string; //伸缩规则的ID
    ScalingGroupId: string; //伸缩组的ID
    ScalingRuleName: string; //伸缩规则的名称
    Cooldown: number; //冷却时间
    AdjustmentType: string; //调整方式
    AdjustmentValue: number; //调整值
    ScalingRuleAri: string; //伸缩规则的唯一标识符
}

export class ScalingInstance {
    InstanceId: string; //ECS实例的ID
    ScalingGroupId: string; //所属的伸缩组的ID
    ScalingConfigurationId: string; //关联的伸缩配置ID
    HealthStatus: string; //在伸缩组中的健康状态 - Healthy：健康的ECS实例。- Unhealthy：不健康的ECS实例。
    LifecycleState: string; //在伸缩组中的生命周期状态 - InService：已成功加入伸缩组并正常运行。- Pending：正在加入伸缩组但还未完成相关配置。- Removing：正在移出伸缩组。
    CreationTime: string; //加入伸缩组的时间
    CreationType: string; //ECS实例的创建类型 - AutoCreated：由弹性伸缩自动在伸缩组中创建。- Attached：在弹性伸缩之外创建，并由用户手工加入伸缩组。
}

export class ScalingActivitie {
    ScalingActivityId: string; //伸缩活动的 ID
    ScalingGroupId: string; //伸缩组的 ID
    Description: string; //伸缩活动的描述信息
    Cause: string; //触发伸缩活动的原因
    StartTime: string; //伸缩活动的开始时间
    EndTime: string; //伸缩活动的结束时间
    Progress: number; //伸缩活动的运行进度
    StatusCode: string; //伸缩活动的当前状态 - Successful：执行成功的伸缩活动。- Warning：部分执行成功的伸缩活动。- Failed：执行失败的伸缩活动。- InProgress：正在执行的伸缩活动。- Rejected：执行伸缩活动请求被拒绝。
    StatusMessage: string; //伸缩活动的状态信息
}
