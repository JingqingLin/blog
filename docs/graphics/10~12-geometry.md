- 纹理的应用
- 几何简介（本课程的第二部分，第一部分是光栅化）
  - 几何的例子
  - 不同的几何表示方法
- 曲线与曲面
- 网格处理、阴影图

## 纹理的应用

- 环境贴图
  - 犹他茶壶
  - Spherical Environment Map：球体表面展开会存在扭曲（distortion）的问题（展开的世界地区南北极附近的面积会显得特别大），解决方法是 Cube Map
  - Cube Map
- 存储微几何：视频 20 分钟左右
  - 凹凸贴图，记录模型表面的高度偏移量，根据高度变化来计算法线方向，不改变几何信息
  - 位移贴图（Displacement Mapping），顶点做位移，改变几何信息，效果比凹凸贴图更好，需要**模型足够精细或使用曲面细分**
- 过程纹理：3D 过程噪声（Perlin 噪声）+ 实体建模
- 预计算着色：带环境光遮蔽的纹理
- 3D 纹理与体积渲染

## 几何简介

### 隐式几何

- 代数曲面
  - 表面的点满足某种关系，但不给出实际的点，如 $x^2 + y^2 + z^2 = 1$ 来表示球面
  - 很难找出所有的点，判断点是否在表面上很容易
- 构造实体几何（Constructive Solid Geometry）：通过布尔运算**组合**隐式几何，课件 10-P44
- 距离函数（Distance Funtion）
  - 记录如 $1 \times 1 \times 1$ 空间内任意一点到几何表面的最近距离，SDF 可以通过 3D 纹理的形式来表示，每个 texel 保存距离信息（GPU 粒子常通过 SDF 来凝聚到表面）
  - 例子：融合两个几何的边界，即对两个几何的 SDF 函数做融合，视频 1 小时 05 分钟左右
  - Raymarching
    - https://youtu.be/Cp5WWtMoeKg
    - https://zhuanlan.zhihu.com/p/94499619
- *水平集（Level Sets）*：距离函数的表达方式（？）
- *分形（fractals）*：如雪花末端

### 显式几何

- **直接给出**所有点（点云）或通过**参数映射**，$f(u, v)=((2+\cos u) \cos v,(2+\cos u) \sin v, \sin u)$ 之所以是显示，是因为 $x, y, z$ 都能看出直接的表达式
  - 很容易找出所有的点，但很难判断某个点在表面的内部还是外部
- 多边形网格（Polygon Mesh），广泛应用于图形学

## 曲线与曲面

### 曲线

- [贝塞尔曲线](https://en.wikipedia.org/wiki/B%C3%A9zier_curve)（Bézier Curves）：利用一系列的控制点定义曲线
  - 一般的矢量图形软件通过它来精确画出曲线
  - 属于显式表示
  - 二次方贝塞尔曲线推导：![](_images/1012-01.png ':class=resizedImage')
  - [通用定义](https://en.wikipedia.org/wiki/B%C3%A9zier_curve#General_definition)：![](_images/1012-02.png ':class=resizedImage')
  - 仿射变换性质：变换控制点即可变换曲线
  - 凸包的性质：曲线不会超过控制点形成的凸包
  - 分段贝塞尔曲线（Piecewise Bézier Curves）：广泛用于字体、路径、插图、幻灯片等；两个函数在值上连续为 $C^0$ 连续（点连续），切线连续为 $C^1$ 连续
- 样条（Spline）：通过一组给定点集来生成平滑曲线
  - B-样条，https://www.bilibili.com/video/BV13441127CH

### 曲面

- 贝塞尔曲面（Bézier Surfaces）：两个方向上应用贝塞尔曲线，即要找两个时间 t(u, v)，视频 11 节第 54 分展示了动画
- 网格应用更广泛，下一部分有关网格操作

## 网格处理

- 网格细分
- 网格简化
- 网格正规化：令三角形更接近正三角形

### 网格细分

位移贴图是网格细分的一个应用场景。

#### Loop 细分（Loop Subdivision）

> Loop 是人名

用于三角形面的细分。对于新生成的顶点：

![](_images/1012-03.png ':class=resizedImage')

对于旧顶点：

![](_images/1012-04.png ':class=resizedImage')
图示顶点的度为 6

#### Catmull-Clark 细分（通用的细分方式）

可用作各种不同的面（不止于三角形）。

奇异点（Extraordinary Vertex）的度不为 4。

细分步骤：
1. 在要细分的面上添加一个点
2. 在要细分的面的每条边上添加点
3. 连接所有新增的点

非四边形面在细分后内部会出现一个奇异点，且面被细分为多个四边形，后续的细分则不会再新增奇异点。

点的更新规则：  
![](_images/1012-05.png ':class=resizedImage')

### 网格简化

目标——在保持整体形状的同时减少网格元素的数量。多应用于移动段和远距离模型。

- 边坍缩（Edge Collapse）
  - 可理解为把边“捏”成一个点
  - “捏”完后的点位置在哪里？二次误差度量（Quadric Error Metrics）：新的点与相关三角形面的平方距离之和最小
![](_images/1012-06.png ':class=resizedImage')
  - 要从哪些边开始“捏”？从二次误差度量最小的边开始。但是“捏”完一条边后，某些边的二次误差度量会发生变化，要更新数据并重新排序，可以用**堆**或优先队列来存储数据。从局部最优解找全局最优解——属于贪心算法

<hr>
<center>几何部分结束</center>
<hr>

## 阴影贴图（Shadow Mapping）

> 为光线追踪铺垫

参考资料：[阴影映射 - LearnOpenGL CN](https://learnopengl-cn.github.io/05%20Advanced%20Lighting/03%20Shadows/01%20Shadow%20Mapping/)

- 一种基于图像空间的算法
  - 阴影计算期间不知道场景内的几何
  - 要对走样进行处理
- 不在阴影里的点会被相机和光源同时看到
- 阴影边界比较锐利的叫硬阴影，较柔和的叫软阴影。类似于日食中的本影和半影。**点光源不会出现软阴影**
![](_images/1012-07.png ':class=resizedImage')
- 阴影图的分辨率会影响性能和阴影效果



- 步骤：
  1. Pass 1：光源视角构建深度图
  2. Pass 2A：相机视角构建深度图像
  3. Pass 2B：相机视角可见点的深度投影回光源视角，若深度一致，则说明可被光源和相机看见，则该点不在阴影内；若不一致，则该点位于阴影内


